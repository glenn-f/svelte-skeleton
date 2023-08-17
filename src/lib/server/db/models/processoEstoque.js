import { EE_AVALIACAO, FCC_CUSTO, FCC_RECEITA, FC_C_COMPRA_MERCADORIA, FC_C_ENCARGO_TRANSACAO, FC_C_RECOMPRA_MERCADORIA, FC_R_VENDA_MERCADORIA, FE_BUYBACK, FE_COMPRA, FE_VENDA, FF_ENCARGO, FF_PAGAMENTO, FF_RECEBIMENTO, PE_COMPRA, PE_PERDA, mapCausasErro } from "$lib/globals"
import { handleAnyError, rateioEstoque, roundBy } from "$lib/helpers"
import { currencyToInt, intToPerc } from "$lib/types"
import { begin, commit, db, dbInsert, dbSelectOne, dbUpdate, rollback } from ".."

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
e.estado, e.condicao, e.origem, e.codigo,CAST(fc_fe.valor_inicial AS REAL)/10000 custo,fc.classe_fc,fc.tipo_fc FROM fe \
LEFT JOIN pessoa r ON r.id = fe.responsavel_id \
LEFT JOIN estoque e ON e.id = fe.estoque_id \
LEFT JOIN produto p ON p.id = e.produto_id \
LEFT JOIN fc_fe ON fc_fe.fe_id = fe.id \
JOIN fc ON fc.id = fc_fe.fc_id AND fc.fcg_id IS NULL \
WHERE fe.pe_id = $id").all({ id })
    //* Transações + Encargos (Custo Encargo)
    data.ff = db.prepare("SELECT t.id,ff.conta_id,tc.nome conta,tft.conta_forma_id,tcf.nome conta_forma,t.forma_transacao_id,tft.parcela parcela,CAST(ff.valor AS REAL)/10000 valor,ff.tipo_ff,CAST(enc_ff.valor AS REAL)/10000 encargo_valor,enc_ff.tipo_ff encargo_tipo_ff FROM ff \
JOIN transacao t ON ff.id = t.transacao_ff_id \
JOIN pe_transacao pet ON t.id = pet.transacao_id AND pet.pe_id = $id \
JOIN forma_transacao tft ON tft.id = t.forma_transacao_id \
JOIN conta_forma tcf ON tcf.id = tft.conta_forma_id \
JOIN conta tc ON tc.id = tcf.conta_id \
LEFT JOIN ff enc_ff ON enc_ff.id = t.encargo_ff_id").all({ id })
    //* Outros Lançamentos
    data.fc = db.prepare("SELECT fc.fcg_id,fc.classe_fc,fc.tipo_fc,CAST(SUM(fc.valor) AS REAL)/10000 valor,fc.observacoes FROM pe_fcg p JOIN fc ON fc.fcg_id = p.fcg_id \
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
    const data = db.prepare("SELECT pe.id,pe.criacao,pe.responsavel_id,r.nome responsavel,pe.participante_id,p.nome participante,pe.tipo_pe,pe.delecao FROM pe LEFT JOIN pessoa r ON r.id = pe.responsavel_id LEFT JOIN pessoa p ON p.id = pe.participante_id WHERE pe.empresa_id = $empresa_id AND pe.tipo_pe > 0 AND pe.tipo_pe <= 100").all({ empresa_id })
    return { valid: true, data }
  } catch (e) {
    const { cause, errorType, fieldErrors } = handleAnyError(e)
    return { valid: false, message: mapCausasErro.get(cause), errorType, fieldErrors, code: cause }
  }
}

//TODO iniciar refazimento bruto, fazer funcoes auxiliares para entidades comuns
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
//TODO .......................xxxxxxxxxxxxxxx...........................!!
/** Insere os dados da saída de estoque no banco de dados
 * @param {DadosCriarSaida} dados 
 * @returns {DBRun<{}>} */ //TODO
export function criarSaida(dados) {
  const { criador_id, empresa_id, participante_id, responsavel_id, tipo_pe, observacoes, buyback, contabil, estoque_saida, transacoes } = dados

  if (tipo_pe === PE_PERDA) return; //TODO perda
  //! Preparar rateio
  const totalVendas = roundBy(estoque_saida.reduce((acc, { valor }) => acc + valor, 0), 2)
  for (let i = 0; i < estoque_saida.length; i++) {
    const e = estoque_saida[i]
    e.percRateio = totalVendas ? e.valor / totalVendas : 1 / estoque_saida.length
    e.rateiosFinanceiro = []
    e.rateiosContabil = []
  }

  try {
    begin.run()
    //! Criar Saída (Processo Estoque)
    const resPE = dbInsert('pe', { tipo_pe, criador_id, empresa_id, participante_id, responsavel_id, observacoes })
    if (resPE.changes === 0) throw new Error("(Saída) Processo de Estoque não foi criado")
    const pe_id = resPE.lastInsertRowid

    //! Criar Buybacks
    for (let i = 0; i < buyback.length; i++) {
      let { custo, qntd, ...restBuyback } = buyback[i]
      custo = Math.abs(currencyToInt(custo))
      const eFinal = { qntd, custo, estado: EE_AVALIACAO, ...restBuyback }
      const alteracoes_json = JSON.stringify([eFinal])

      //* Criar Estoque-Buyback
      const resEstoque = dbInsert('estoque', eFinal)
      if (resEstoque.changes === 0) throw new Error(`(Venda) Buyback-Estoque[${i}] não foi criado`)
      const estoque_id = resEstoque.lastInsertRowid

      //* Criar Fluxo de Estoque-Buyback
      const resFE = dbInsert('fe', { estoque_id, pe_id, responsavel_id, tipo_fe: FE_BUYBACK, var_qntd: qntd, var_custo: custo, observacoes, alteracoes_json })
      if (resEstoque.changes === 0) throw new Error(`(Venda) Buyback-FE[${i}] não foi criado`)
      const fe_id = resFE.lastInsertRowid

      //* Criar Fluxo Contábil para Recompra de Mercadoria
      const resFC = dbInsert('fc', { empresa_id, criador_id, tipo_fc: FC_C_RECOMPRA_MERCADORIA, valor: -custo })
      if (resFC.changes === 0) throw new Error(`(Venda) Buyback-FC[${i}] não foi criado`)
      const fc_id = resFC.lastInsertRowid

      //* Criar Associação do Estoque com Custo de Aquisição - Buyback
      const resFC_FE = dbInsert('fc_fe', { fc_id, fe_id, valor_inicial: -custo })
      if (resFC_FE.changes === 0) throw new Error(`(Venda) FC_FE[${i}] não foi criado`)
    }

    //! Criar Transações
    const encargos = []
    const forma_transacao_ids = transacoes.map((v) => v.forma_transacao_id).join(',')
    const contas = db.prepare(`SELECT cf.conta_id,ft.id,ft.taxa_encargo FROM forma_transacao ft JOIN conta_forma cf ON cf.id = ft.conta_forma_id WHERE ft.id IN (${forma_transacao_ids})`).all()
    for (let i = 0; i < transacoes.length; i++) {
      let { forma_transacao_id, valor } = transacoes[i];
      let { conta_id, taxa_encargo } = contas.find((v) => v.id === forma_transacao_id) ?? {}

      //*Verificar se há encargo de transação
      let encargo_ff_id = undefined
      let valor_encargo = Math.abs((intToPerc(taxa_encargo) * valor) || 0)
      if (valor_encargo !== 0) {
        //? Criar Fluxo Financeiro - Encargo
        valor_encargo = -currencyToInt(valor_encargo)
        const resEncargoFF = dbInsert('ff', { conta_id, tipo_ff: FF_ENCARGO, valor: valor_encargo, criador_id })
        if (resEncargoFF.changes === 0) throw new Error(`(Venda) Fluxo Financeiro - Encargo[${i}] não foi criado`)
        encargo_ff_id = resEncargoFF.lastInsertRowid
        encargos.push({ ff_id: encargo_ff_id, valor: valor_encargo })
      }

      //* Criar Fluxo Financeiro - Recebimento
      valor = currencyToInt(valor)
      const resPagamentoFF = dbInsert('ff', { conta_id, tipo_ff: FF_RECEBIMENTO, valor, criador_id })
      if (resPagamentoFF.changes === 0) throw new Error(`(Venda) Fluxo Financeiro - Recebimento[${i}] não foi criado`)
      const transacao_ff_id = resPagamentoFF.lastInsertRowid

      //* Criar Transação
      const resTransacao = dbInsert('transacao', { transacao_ff_id, encargo_ff_id, forma_transacao_id })
      if (resTransacao.changes === 0) throw new Error(`(Venda) Transação[${i}] não foi criada`)
      const transacao_id = resTransacao.lastInsertRowid

      //* Criar Associação Processo Estoque - Transação
      const resPETransacao = dbInsert('pe_transacao', { pe_id, transacao_id })
      if (resPETransacao.changes === 0) throw new Error(`(Venda) Associação Processo Estoque - Transação[${i}] não foi criada`)

      //* Subtrair saldo da conta
      valor = valor + valor_encargo
      if (valor === 0) continue
      const resUpdateConta = db.prepare("UPDATE conta SET saldo = saldo + $valor WHERE id = $conta_id").run({ valor, conta_id })
      if (resUpdateConta.changes === 0) throw new Error(`(Venda) Atualização do saldo da conta ${conta_id} - transação [${i}] falhou`)
    }

    //! Rateio de Encargos como custos
    for (let i = 0; i < encargos.length; i++) {
      const e = encargos[i]

      //* Criar Grupo de Fluxo Contábil
      const resFCG = dbInsert('fcg', { id: null })
      if (resFCG.changes === 0) throw new Error(`(Venda) Criação de Grupo de Custo para Encargo[${i}] falhou`)
      e.fcg_id = resFCG.lastInsertRowid
      rateioEstoque(e.valor, estoque_saida, 'rateiosFinanceiro', { fcg_id: e.fcg_id, ff_id: e.ff_id, tipo_fc: FC_C_ENCARGO_TRANSACAO })

      //* Associar Grupo ao Processo do Estoque (Venda)
      const resPE_FCG = dbInsert('pe_fcg', { fcg_id: e.fcg_id, pe_id })
      if (resPE_FCG.changes === 0) throw new Error(`(Venda) Associação de Grupo de Custo com PE falhou. Encargo [${i}]`)
    }

    //! Rateio de Custos e Receitas (Contábil)
    for (let i = 0; i < contabil.length; i++) {
      const { tipo_fc, valor, observacoes } = contabil[i]

      //* Criar Grupo de Fluxo Contábil
      const resFCG = dbInsert('fcg', { id: null })
      if (resFCG.changes === 0) throw new Error(`(Venda) Criação de Grupo de Custo para Contabil[${i}] falhou`)
      const fcg_id = resFCG.lastInsertRowid
      rateioEstoque(currencyToInt(valor), estoque_saida, 'rateiosContabil', { fcg_id, tipo_fc, observacoes })

      //* Associar Grupo ao Processo do Estoque (Venda)
      const resPE_FCG = dbInsert('pe_fcg', { fcg_id, pe_id })
      if (resPE_FCG.changes === 0) throw new Error(`(Venda) Associação de Grupo de Custo com PE falhou. Contabil [${i}]`)
    }

    //! Criar Saída de Estoque
    for (let i = 0; i < estoque_saida.length; i++) {
      let { id: estoque_id, observacoes, qntd, responsavel_id, tipo_fe, valor, rateiosFinanceiro, rateiosContabil } = estoque_saida[i]
      valor = currencyToInt(valor)

      //* Verificar Estoque
      const eInicial = dbSelectOne('estoque', ["qntd", "custo"], { id: estoque_id })
      if (!eInicial || qntd > eInicial.qntd) throw new Error(`Estoque[${i}].qntd maior que e_inicial.qntd: ${qntd} > ${eInicial?.qntd}`)
      const var_qntd = -qntd
      const var_custo = -Math.floor(eInicial.custo * (qntd / eInicial.qntd))
      const eFinal = { qntd: eInicial.custo + var_custo, custo: eInicial.qntd + var_custo }
      const alteracoes_json = JSON.stringify([eFinal, eInicial])

      //* Atualizar Estoque
      const resEstoque = dbUpdate('estoque', eFinal, { id: estoque_id })
      if (resEstoque.changes === 0) throw new Error(`(Venda) Estoque[${i}] não foi atualizado`)

      //* Criar Fluxo de Estoque
      const resFE = dbInsert('fe', { estoque_id, pe_id, responsavel_id, tipo_fe, var_qntd, var_custo, observacoes, alteracoes_json })
      if (resFE.changes === 0) throw new Error(`(Venda) FE[${i}] não foi criado`)
      const fe_id = resFE.lastInsertRowid

      //* Criar Fluxo Contábil para a Venda de Mercadoria
      const resFC = dbInsert('fc', { empresa_id, criador_id, tipo_fc: FC_R_VENDA_MERCADORIA, valor })
      if (resFC.changes === 0) throw new Error(`(Venda) FC[${i}] não foi criado`)
      const fc_id = resFC.lastInsertRowid

      //* Criar Associação do Estoque com a Venda da Mercadoria
      const resFC_FE = dbInsert('fc_fe', { fc_id, fe_id, valor_inicial: valor })
      if (resFC_FE.changes === 0) throw new Error(`(Venda) FC_FE[${i}] não foi criado`)

      //* Criar Custos de Transação Rateado para o Estoque
      for (let i = 0; i < rateiosFinanceiro.length; i++) {
        const { fcg_id, ff_id, tipo_fc, valor } = rateiosFinanceiro[i];

        //? Criar Fluxo Contábil para Custo Financeiro
        const resFC = dbInsert('fc', { empresa_id, criador_id, tipo_fc, valor, fcg_id })
        if (resFC.changes === 0) throw new Error(`(Venda) FC Financeiro[${i}] não foi criado`)
        const fc_id = resFC.lastInsertRowid

        //? Criar Associação do Estoque com Custo Financeiro
        const resFC_FE = dbInsert('fc_fe', { fc_id, fe_id, valor_inicial: valor })
        if (resFC_FE.changes === 0) throw new Error(`(Venda) FC_FE Financeiro[${i}] não foi criado`)

        //? Criar Associação do Fluxo Contábil com o Fluxo Financeiro
        const resFC_FF = dbInsert('fc_ff', { fc_id, ff_id })
        if (resFC_FF.changes === 0) throw new Error(`(Venda) FC_FF[${i}] não foi criado`)
      }
      //* Criar Custos Contábeis Rateado para o Estoque
      for (let i = 0; i < rateiosContabil.length; i++) {
        let { fcg_id, tipo_fc, valor, observacoes } = rateiosContabil[i];

        //? Criar Fluxo Contábil
        const resFC = dbInsert('fc', { empresa_id, criador_id, tipo_fc, valor, fcg_id, observacoes })
        if (resFC.changes === 0) throw new Error(`(Venda) FC[${i}] não foi criado`)
        const fc_id = resFC.lastInsertRowid

        //? Criar Associação de Fluxo Contábil ao Fluxo de Estoque
        const resFC_FE = dbInsert('fc_fe', { fc_id, fe_id, valor_inicial: valor })
        if (resFC_FE.changes === 0) throw new Error(`(Venda) FC_FE[${i}] não foi criado`)

      }
      //TODO definir a atualização de custo de (estoque ou fluxo de estoque) ou criação de um FC_Social para Resultado Comercial
      //TODO estes lançamentos contabeis estão associados ao fluxo de estoque, mais não gerar resultado nem são deduzidos ou somados ao estoque.custo
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
 * @param {{empresa_id: number}} dados 
 */
export function consultarSaidas(dados) {
  const { empresa_id } = dados
  try {
    const data = db.prepare("SELECT pe.id,pe.criacao,pe.responsavel_id,r.nome responsavel,pe.participante_id,p.nome participante,pe.tipo_pe,pe.delecao FROM pe LEFT JOIN pessoa r ON r.id = pe.responsavel_id LEFT JOIN pessoa p ON p.id = pe.participante_id WHERE pe.empresa_id = $empresa_id AND pe.tipo_pe > 100 AND pe.tipo_pe <= 200").all({ empresa_id })
    return { valid: true, data }
  } catch (e) {
    const { cause, errorType, fieldErrors } = handleAnyError(e)
    return { valid: false, message: mapCausasErro.get(cause), errorType, fieldErrors, code: cause }
  }
}

//!JSDocs
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
 * @typedef {CriarSaida & {criador_id, empresa_id}} DadosCriarSaida
 */

/** @typedef {import('$lib/zod/schemas/processoEstoque').CriarEntrada} CriarEntrada */
/** @typedef {import('$lib/zod/schemas/processoEstoque').CriarSaida} CriarSaida */