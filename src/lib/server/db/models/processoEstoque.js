import { FCC_CUSTO, FCC_RECEITA, FC_C_COMPRA_MERCADORIA, FC_C_ENCARGO_TRANSACAO, FE_COMPRA, FF_ENCARGO, FF_PAGAMENTO, PE_COMPRA, mapCausasErro } from "$lib/globals"
import { handleAnyError, rateioEstoque } from "$lib/helpers"
import { currencyToInt, intToPerc } from "$lib/types"
import { begin, commit, db, dbInsert, rollback } from ".."

/**
 * @param {{id: number}} dados 
 */
export function detalharEntrada(dados) {
  const { id } = dados
  try {
    //* Processo de Estoque
    const data = db.prepare("SELECT pe.*,r.nome responsavel,p.nome participante,u.nome criador FROM pe LEFT JOIN pessoa r ON r.id = pe.responsavel_id \
LEFT JOIN pessoa p ON p.id = pe.participante_id LEFT JOIN usuario u ON u.id = pe.criador_id WHERE pe.id = $id").get({ id })
    if (!data) throw new Error("ID da entrada não existe")
    //* Fluxo de Estoque
    data.fe = db.prepare("SELECT fe.id,fe.tipo_fe,fe.qntd,fe.observacoes,fe.responsavel_id,r.nome responsavel,fe.estoque_id,e.produto_id,p.nome produto, \
e.estado, e.condicao, e.origem, e.codigo,fc_fe.valor_inicial/10000 custo,fc.classe_fc,fc.tipo_fc FROM fe \
LEFT JOIN pessoa r ON r.id = fe.responsavel_id \
LEFT JOIN estoque e ON e.id = fe.estoque_id \
LEFT JOIN produto p ON p.id = e.produto_id \
LEFT JOIN fc_fe ON fc_fe.fe_id = fe.id \
JOIN fc ON fc.id = fc_fe.fc_id AND fc.fcg_id IS NULL \
WHERE fe.pe_id = $id").all({ id })
    //* Transações + Encargos (Custo Encargo)
    data.ff = db.prepare("SELECT t.id,ff.conta_id,tc.nome conta,tft.conta_forma_id,tcf.nome conta_forma,t.forma_transacao_id,tft.parcela parcela,ff.valor/10000 valor,ff.tipo_ff,enc_ff.valor/10000 encargo_valor,enc_ff.tipo_ff encargo_tipo_ff FROM ff \
JOIN transacao t ON ff.id = t.transacao_ff_id \
JOIN pe_transacao pet ON t.id = pet.transacao_id AND pet.pe_id = $id \
JOIN forma_transacao tft ON tft.id = t.forma_transacao_id \
JOIN conta_forma tcf ON tcf.id = tft.conta_forma_id \
JOIN conta tc ON tc.id = tcf.conta_id \
LEFT JOIN ff enc_ff ON enc_ff.id = t.encargo_ff_id").all({ id })
    //* Outros Lançamentos
    data.fc = db.prepare("SELECT fc.fcg_id,fc.classe_fc,fc.tipo_fc,SUM(fc.valor)/10000 valor,fc.observacoes FROM pe_fcg p JOIN fc ON fc.fcg_id = p.fcg_id \
WHERE p.pe_id = $id GROUP BY fc.fcg_id").all({ id })
    return { valid: true, data }
  } catch (e) {
    const { cause, errorType, fieldErrors } = handleAnyError(e)
    const msg = errorType == 'Error' ? e.message : mapCausasErro.get(cause)
    const code = errorType == 'Error' ? 400 : cause
    return { valid: false, message: msg, errorType, fieldErrors, code }
  }
}


/**
 * @param {{empresa_id: number}} dados 
 */
export function consultarEntradas(dados) {
  const { empresa_id } = dados
  try {
    const data = db.prepare("SELECT pe.id,pe.criacao,pe.responsavel_id,r.nome responsavel,pe.participante_id,p.nome participante,pe.tipo_pe,pe.delecao FROM pe LEFT JOIN pessoa r ON r.id = pe.responsavel_id LEFT JOIN pessoa p ON p.id = pe.participante_id WHERE pe.empresa_id = $empresa_id").all({ empresa_id })
    return { valid: true, data }
  } catch (e) {
    const { cause, errorType, fieldErrors } = handleAnyError(e)
    return { valid: false, message: mapCausasErro.get(cause), errorType, fieldErrors, code: cause }
  }
}

/** Insere os dados da entrada de estoque no banco de dados
 * @param {DadosCriarEntrada} dados 
 * @returns {DBRun<Entrada>} */
export function criarEntrada(dados) {
  const { criador_id, empresa_id, participante_id, responsavel_id, observacoes, estoque, transacoes, contabil } = dados

  //! Preparar rateio
  const totalCustoEstoque = estoque.reduce((acc, { custo }) => acc + custo, 0)
  for (let i = 0; i < estoque.length; i++) {
    const e = estoque[i]
    e.percRateio = totalCustoEstoque ? e.custo / totalCustoEstoque : 1 / estoque.length
    e.rateiosFinanceiro = []
    e.rateiosContabil = []
    //TODO adicionar outros rateios ex: rateiosCustosProcesso -> brindes, transporte, frete, troco etc
  }

  try {
    begin.run()
    //! Criar Entrada
    const resPE = dbInsert('pe', { tipo_pe: PE_COMPRA, criador_id, empresa_id, participante_id, responsavel_id, observacoes })
    if (resPE.changes === 0) throw new Error("(Compra) Processo de Estoque não foi criado")
    const pe_id = resPE.lastInsertRowid

    //! Criar Transações
    const encargos = []
    const forma_transacao_ids = transacoes.map((v) => v.forma_transacao_id).join(',')
    const contas = db.prepare(`SELECT cf.conta_id,ft.id,ft.taxa_encargo FROM forma_transacao ft JOIN conta_forma cf ON cf.id = ft.conta_forma_id WHERE ft.id IN (${forma_transacao_ids})`).all()
    for (let i = 0; i < transacoes.length; i++) {
      let { forma_transacao_id, valor } = transacoes[i];
      let { conta_id, taxa_encargo } = contas.find((v) => v.id === forma_transacao_id) ?? {}

      //*Verificar se há encargo de transação
      let encargo_ff_id = undefined
      let valor_encargo = intToPerc(taxa_encargo) * valor
      if (Number.isFinite(valor_encargo) && valor_encargo !== 0) {
        //? Criar Fluxo Financeiro - Encargo
        valor_encargo = currencyToInt(valor_encargo)
        const resEncargoFF = dbInsert('ff', { conta_id, tipo_ff: FF_ENCARGO, valor: valor_encargo, criador_id })
        if (resEncargoFF.changes === 0) throw new Error(`(Compra) Fluxo Financeiro - Encargo[${i}] não foi criado`)
        encargo_ff_id = resEncargoFF.lastInsertRowid
        encargos.push({ ff_id: encargo_ff_id, valor: valor_encargo })
      }

      //* Criar Fluxo Financeiro - Pagamento
      valor = currencyToInt(valor)
      const resPagamentoFF = dbInsert('ff', { conta_id, tipo_ff: FF_PAGAMENTO, valor, criador_id })
      if (resPagamentoFF.changes === 0) throw new Error(`(Compra) Fluxo Financeiro - Pagamento[${i}] não foi criado`)
      const transacao_ff_id = resPagamentoFF.lastInsertRowid

      //* Criar Transação
      const resTransacao = dbInsert('transacao', { transacao_ff_id, encargo_ff_id, forma_transacao_id })
      if (resTransacao.changes === 0) throw new Error(`(Compra) Transação[${i}] não foi criada`)
      const transacao_id = resTransacao.lastInsertRowid

      //* Criar Associação Processo Estoque - Transação
      const resPETransacao = dbInsert('pe_transacao', { pe_id, transacao_id })
      if (resPETransacao.changes === 0) throw new Error(`(Compra) Associação Processo Estoque - Transação[${i}] não foi criada`)

      //* Subtrair saldo da conta
      valor = valor + valor_encargo
      if (valor === 0) continue
      const resUpdateConta = db.prepare("UPDATE conta SET saldo = saldo - $valor WHERE id = $conta_id").run({ valor, conta_id })
      if (resUpdateConta.changes === 0) throw new Error(`(Compra) Atualização do saldo da conta ${conta_id} - transação [${i}] falhou`)
    }

    //! Rateio de Encargos como custos
    for (let i = 0; i < encargos.length; i++) {
      const e = encargos[i]

      //* Criar Grupo de Fluxo Contábil
      const resFCG = dbInsert('fcg', { id: null })
      if (resFCG.changes === 0) throw new Error(`(Compra) Criação de Grupo de Custo para Encargo[${i}] falhou`)
      e.fcg_id = resFCG.lastInsertRowid
      rateioEstoque(e.valor, estoque, 'rateiosFinanceiro', { fcg_id: e.fcg_id, ff_id: e.ff_id, classe_fc: FCC_CUSTO, tipo_fc: FC_C_ENCARGO_TRANSACAO })

      //* Associar Grupo ao Processo do Estoque (Compra)
      const resPE_FCG = dbInsert('pe_fcg', { fcg_id: e.fcg_id, pe_id })
      if (resPE_FCG.changes === 0) throw new Error(`(Compra) Associação de Grupo de Custo com PE falhou. Encargo [${i}]`)
    }

    //! Rateio de Custos e Receitas (Contábil)
    for (let i = 0; i < contabil.length; i++) {
      const { classe_fc, tipo_fc, valor, observacoes } = contabil[i]

      //* Criar Grupo de Fluxo Contábil
      const resFCG = dbInsert('fcg', { id: null })
      if (resFCG.changes === 0) throw new Error(`(Compra) Criação de Grupo de Custo para Contabil[${i}] falhou`)
      const fcg_id = resFCG.lastInsertRowid
      rateioEstoque(currencyToInt(valor), estoque, 'rateiosContabil', { fcg_id, classe_fc, tipo_fc, observacoes })

      //* Associar Grupo ao Processo do Estoque (Compra)
      const resPE_FCG = dbInsert('pe_fcg', { fcg_id, pe_id })
      if (resPE_FCG.changes === 0) throw new Error(`(Compra) Associação de Grupo de Custo com PE falhou. Contabil [${i}]`)
    }

    //! Criar Estoques
    for (let i = 0; i < estoque.length; i++) {
      let { codigo, condicao, custo, estado, observacoes, origem, preco_unitario, produto_id, qntd, rateiosFinanceiro, rateiosContabil } = estoque[i]
      custo = currencyToInt(custo)
      preco_unitario = Number.isFinite(preco_unitario) ? currencyToInt(preco_unitario) : undefined

      //* Criar Estoque
      const resEstoque = dbInsert('estoque', { produto_id, qntd, custo, preco_unitario, estado, condicao, origem, codigo, observacoes, criador_id })
      if (resEstoque.changes === 0) throw new Error(`(Compra) Estoque[${i}] não foi criado`)
      const estoque_id = resEstoque.lastInsertRowid

      //* Criar Fluxo de Estoque
      const resFE = dbInsert('fe', { estoque_id, pe_id, responsavel_id, qntd, diferenca_preco: 0, observacoes, tipo_fe: FE_COMPRA })
      if (resEstoque.changes === 0) throw new Error(`(Compra) FE[${i}] não foi criado`)
      const fe_id = resFE.lastInsertRowid

      //* Criar Fluxo Contábil para Custo da Mercadoria
      const resFC = dbInsert('fc', { empresa_id, criador_id, classe_fc: FCC_CUSTO, tipo_fc: FC_C_COMPRA_MERCADORIA, valor: custo })
      if (resFC.changes === 0) throw new Error(`(Compra) FC[${i}] não foi criado`)
      const fc_id = resFC.lastInsertRowid

      //* Criar Associação do Estoque com Custo de Aquisição
      const resFC_FE = dbInsert('fc_fe', { fc_id, fe_id, valor_inicial: custo })
      if (resFC_FE.changes === 0) throw new Error(`(Compra) FC_FE[${i}] não foi criado`)

      //* Criar Custos de Transação Rateado para o Estoque
      for (let i = 0; i < rateiosFinanceiro.length; i++) {
        const { fcg_id, ff_id, classe_fc, tipo_fc, valor } = rateiosFinanceiro[i];

        //? Criar Fluxo Contábil para Custo Financeiro
        const resFC = dbInsert('fc', { empresa_id, criador_id, classe_fc, tipo_fc, valor, fcg_id })
        if (resFC.changes === 0) throw new Error(`(Compra) FC Financeiro[${i}] não foi criado`)
        const fc_id = resFC.lastInsertRowid

        //? Criar Associação do Estoque com Custo Financeiro
        const resFC_FE = dbInsert('fc_fe', { fc_id, fe_id, valor_inicial: valor })
        if (resFC_FE.changes === 0) throw new Error(`(Compra) FC_FE Financeiro[${i}] não foi criado`)

        //? Criar Associação do Fluxo Contábil com o Fluxo Financeiro
        const resFC_FF = dbInsert('fc_ff', { fc_id, ff_id })
        if (resFC_FF.changes === 0) throw new Error(`(Compra) FC_FF[${i}] não foi criado`)

        //? Atualizar custo do estoque
        const resUpdateEstoque = db.prepare("UPDATE estoque SET custo = custo + $valor WHERE id = $estoque_id").run({ valor, estoque_id })
        if (resUpdateEstoque.changes === 0) throw new Error(`(Compra) Atualização do custo do estoque ${estoque_id} - custo transacao rateado [${i}] falhou`)
      }
      //* Criar Custos Contábeis Rateado para o Estoque
      for (let i = 0; i < rateiosContabil.length; i++) {
        let { fcg_id, classe_fc, tipo_fc, valor, observacoes } = rateiosContabil[i];

        //? Criar Fluxo Contábil
        const resFC = dbInsert('fc', { empresa_id, criador_id, classe_fc, tipo_fc, valor, fcg_id, observacoes })
        if (resFC.changes === 0) throw new Error(`(Compra) FC[${i}] não foi criado`)
        const fc_id = resFC.lastInsertRowid

        //? Criar Associação de Fluxo Contábil ao Fluxo de Estoque
        const resFC_FE = dbInsert('fc_fe', { fc_id, fe_id, valor_inicial: valor })
        if (resFC_FE.changes === 0) throw new Error(`(Compra) FC_FE[${i}] não foi criado`)

        //? Atualizar custo do estoque
        valor = valor * (classe_fc === FCC_RECEITA ? -1 : 1)
        const resUpdateEstoque = db.prepare("UPDATE estoque SET custo = custo + $valor WHERE id = $estoque_id").run({ valor, estoque_id })
        if (resUpdateEstoque.changes === 0) throw new Error(`(Compra) Atualização do custo do estoque ${estoque_id} - custo contabil rateado [${i}] falhou`)
      }
    }
    commit.run()
    return { valid: true, data: pe_id }
  } catch (e) {
    if (db.inTransaction) rollback.run()
    const { errorType, cause, fieldErrors, message } = handleAnyError(e)
    return { valid: false, fieldErrors, message, errorType, code: cause }
  }
}

/**
 * @typedef {Object} Entrada
 * @property {number} id -
 * @property {number} criador_id -
 * @property {number} empresa_id -
 * @property {number} [responsavel_id] -
 * @property {number} tipo_pe -
 * @property {number} [observacoes] -
 * @property {number} criacao -
 * @property {number} [alteracao] -
 * @property {number} [delecao] -
 */


/**
  * @template T
  * @typedef {import('..').DBAll<T>} DBAll<T>
*/

/**
  * @template T
  * @typedef {import('..').DBRun<T>} DBRun<T>
*/

//TODO DBRun v2 para criação da entrada

/**
 * @typedef {CriarEntrada & {criador_id, empresa_id}} DadosCriarEntrada
 */

/**
  * @typedef {import('$lib/zod/schemas/processoEstoque').CriarEntrada} CriarEntrada
*/