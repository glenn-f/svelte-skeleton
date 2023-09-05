import { EE_DISPONIVEL, ERRO_CAMPOS, FE_VENDA } from "$lib/globals";
import { handleAnyError } from "$lib/helpers";
import { currencyToInt, intToCurrency } from "$lib/types";
import { db, dbSelectOne, dbUpdate } from "..";

function transformToCurrencyFields(array, fields) {
  for (let i = 0; i < array.length; i++) {
    const e = array[i]
    for (let j = 0; j < fields.length; j++) {
      const f = fields[j];
      e[f] = intToCurrency(e[f])
    }
  }
}

export function consultarEstoques(dados) {
  const { empresa_id } = dados
  try {
    const data = db.prepare("SELECT pe.id entrada_id,pe.criacao data_entrada,fe.tipo_fe forma_entrada,e.id,e.produto_id,e.qntd,CAST(e.custo AS REAL)/10000 custo,CAST(e.preco_unitario AS REAL)/10000 preco_unitario,e.condicao,e.origem,e.codigo,e.estado,p.nome AS p_nome FROM estoque e LEFT JOIN fe ON fe.estoque_id = e.id AND fe.tipo_fe <= 100 JOIN produto p ON e.produto_id = p.id LEFT JOIN pe ON pe.id = fe.pe_id WHERE p.empresa_id = $empresa_id AND e.qntd > 0").all({ empresa_id })
    return { valid: true, data }
  } catch (e) {
    console.error(e)
    return { valid: false, message: "Erro desconhecido", code: 'DB_UNKNOWN' }
  }
}

export function consultarEstoquesDisponivel(dados) {
  const { empresa_id } = dados
  try {
    const data = db.prepare(`SELECT fe.tipo_fe forma_entrada,e.id,e.produto_id,e.qntd,CAST(e.custo AS REAL)/10000 custo,CAST(e.preco_unitario AS REAL)/10000 preco_unitario,e.condicao,e.origem,e.codigo,p.nome AS produto,e.observacoes FROM estoque e LEFT JOIN fe ON fe.estoque_id = e.id AND fe.tipo_fe <= 100 JOIN produto p ON e.produto_id = p.id LEFT JOIN pe ON pe.id = fe.pe_id WHERE p.empresa_id = $empresa_id AND e.qntd > 0 AND e.estado = 1`).all({ empresa_id })
    return { valid: true, data }
  } catch (e) {
    console.error(e)
    return { valid: false, message: "Erro desconhecido", code: 'DB_UNKNOWN' }
  }
}

export function consultarEstoquesVendidos(dados) {
  const { empresa_id } = dados
  try {
    const data = db.prepare(`SELECT v.nome vendedor,pe.criacao data_venda,e.id,e.produto_id,-fe.var_qntd qntd_venda,CAST(fe.faturamento AS REAL)/10000 preco_total,e.condicao,e.origem,e.codigo,p.nome AS produto,e.observacoes FROM estoque e JOIN fe ON fe.estoque_id = e.id AND fe.tipo_fe = ${FE_VENDA} JOIN produto p ON e.produto_id = p.id JOIN pe ON pe.id = fe.pe_id LEFT JOIN pessoa v ON v.id = fe.responsavel_id WHERE p.empresa_id = $empresa_id`).all({ empresa_id })
    return { valid: true, data }
  } catch (e) {
    console.error(e)
    return { valid: false, message: "Erro desconhecido", code: 'DB_UNKNOWN' }
  }
}

function produtosSaidaMap(produtos, estoques) {
  const map = new Map();
  for (let i = 0; i < produtos.length; i++) {
    const p = produtos[i];
    p.estoque = new Map(estoques.filter((v) => v.produto_id === p.id).map((v) => [v.id, v]))
    map.set(p.id, p)
  }
  return map
}

export function consultarEstoqueSimples(eid) {
  return db.prepare("SELECT *, CAST(preco_unitario AS REAL)/10000 preco_unitario, CAST(custo AS REAL)/10000 custo FROM estoque WHERE id = :eid AND qntd > 0 AND estado = :estado").get({ eid, estado: EE_DISPONIVEL })
}

export function consultarEstoqueSaida(dados) {
  const { empresa_id } = dados
  try {
    const produtos = db.prepare("SELECT 0 qntd_carrinho, p.id, p.nome, SUM(e.qntd) qntd, AVG(CAST(e.preco_unitario AS REAL))/10000 preco_medio, pc.id categoria_id, pc.nome categoria FROM produto p LEFT JOIN produto_categoria pc ON pc.id = p.produto_categoria_id \
JOIN estoque e ON e.produto_id = p.id AND e.qntd > 0 WHERE p.empresa_id = $empresa_id GROUP BY p.id ").all({ empresa_id })
    const estoques = db.prepare(
      "SELECT 0 qntd_carrinho, e.id, e.produto_id, e.qntd, CAST(e.custo AS REAL)/10000 custo, CAST(e.preco_unitario AS REAL)/10000 preco_unitario, e.condicao, e.origem, e.codigo, e.estado, e.observacoes FROM estoque e \
JOIN produto p ON e.produto_id = p.id AND p.empresa_id = $empresa_id WHERE e.qntd > 0 \
ORDER BY e.preco_unitario DESC, e.qntd ASC").all({ empresa_id })
    const data = produtosSaidaMap(produtos, estoques)
    return { valid: true, data }
  } catch (e) {
    console.error(e)
    return { valid: false, message: "Erro desconhecido", code: 'DB_UNKNOWN' }
  }
}

export function consultarEstoqueDisponivelVenda(dados) {
  const { empresa_id } = dados
  try {
    const produtos = db.prepare("SELECT 0 qntd_carrinho, p.id, p.nome, SUM(e.qntd) qntd, AVG(CAST(e.preco_unitario AS REAL))/10000 preco_medio, pc.id categoria_id, pc.nome categoria FROM produto p LEFT JOIN produto_categoria pc ON pc.id = p.produto_categoria_id \
JOIN estoque e ON e.produto_id = p.id AND e.qntd > 0 WHERE p.empresa_id = $empresa_id GROUP BY p.id ").all({ empresa_id })
    const estoques = db.prepare(
      "SELECT 0 qntd_carrinho, e.id, e.produto_id, e.qntd, CAST(e.custo AS REAL)/10000 custo, CAST(e.preco_unitario AS REAL)/10000 preco_unitario, e.condicao, e.origem, e.codigo, e.estado, e.observacoes FROM estoque e \
JOIN produto p ON e.produto_id = p.id AND p.empresa_id = $empresa_id WHERE e.qntd > 0 AND e.estado = :estado \
ORDER BY e.preco_unitario DESC, e.qntd ASC").all({ empresa_id, estado: EE_DISPONIVEL })
    const data = produtosSaidaMap(produtos, estoques)
    return { valid: true, data }
  } catch (e) {
    console.error(e)
    return { valid: false, message: "Erro desconhecido", code: 'DB_UNKNOWN' }
  }
}

function custosToMap(custos) {
  const mapa = new Map();
  for (let i = 0; i < custos.length; i++) {
    const { pe_id, valor, tipo_fc, fc_observacoes, ...pe } = custos[i];
    const lancamento = { valor, tipo_fc, fc_observacoes }

    if (!mapa.has(pe_id)) {
      mapa.set(pe_id, { pe_id, ...pe, contabil: [lancamento] })
    } else {
      mapa.get(pe_id).contabil.push(lancamento)
    }
  }
  return Array.from(mapa.values())
}

export function detalharEstoque(dados) {
  const { empresa_id, id } = dados
  try {
    const data = db.prepare("SELECT e.*, CAST(e.custo AS REAL)/10000 custo, CAST(e.preco_unitario AS REAL)/10000 preco_unitario, p.nome produto_nome, p.titulo_codigo, pc.nome categoria, pc.id categoria_id FROM estoque e \
LEFT JOIN produto p ON p.id = e.produto_id LEFT JOIN produto_categoria pc ON pc.id = p.produto_categoria_id \
WHERE e.id = $id AND p.empresa_id = $empresa_id").get({ id, empresa_id })
    if (!data) return { valid: false, message: "Estoque não encontrado", code: ERRO_CAMPOS }
    const pes = db.prepare("SELECT pe.id pe_id,pe.observacoes,pe.tipo_pe,pe.criacao,fe.tipo_fe,fe.var_qntd,CAST(fe.var_custo AS REAL)/10000 var_custo,fe.observacoes fe_observacoes, CAST(fc_fe.valor_inicial AS REAL)/10000 valor,fc.tipo_fc,fc.observacoes fc_observacoes FROM pe LEFT JOIN fe ON pe.id = pe_id LEFT JOIN fc_fe ON fc_fe.fe_id = fe.id LEFT JOIN fc ON fc.id = fc_fe.fc_id WHERE fe.estoque_id = $id").all({ id })
    data.pes = custosToMap(pes)
    return { valid: true, data }

  } catch (e) {
    const { errorType, cause, fieldErrors, message } = handleAnyError(e)
    return { valid: false, fieldErrors, message, errorType, code: cause }
  }
}


/**
 * @param {DadosEditarItemInventario} dados 
 */
export function editarItemInventario(dados) {
  let { id, criador_id, observacoes, empresa_id, estado, preco_unitario, regra_comissao_id, regra_tributo_id } = dados
  preco_unitario = currencyToInt(preco_unitario)
  try {
    const estoque = db.prepare("SELECT 1 FROM estoque e JOIN produto p ON p.id = e.produto_id WHERE e.id = $id AND p.empresa_id = $empresa_id").get({ id, empresa_id })
    if (!estoque) return { valid: true, message: "Estoque inválido" }
    const res = dbUpdate("estoque", { observacoes, estado, preco_unitario, regra_comissao_id, regra_tributo_id }, { id })
    if (res.changes == 0) return { valid: true, message: "Nenhuma alteração foi efetivada" }
    return { valid: true, message: 'Inventário atualizado com sucesso' }
  } catch (e) {
    const { errorType, cause, fieldErrors, message } = handleAnyError(e)
    return { valid: false, fieldErrors, message, errorType, code: cause }
  }
}

export function alternarStatusEstoque(dados) {

}

/**
 * @typedef {Object} Estoque
 * @property {number} id -
 * @property {number} produto_id - 
 * @property {number} qntd - 
 * @property {number} custo - 
 * @property {number} [preco_unitario] - 
 * @property {number} estado - 
 * @property {number} condicao - 
 * @property {number} origem - 
 * @property {string} [codigo] - 
 * @property {string} [dados_json] - 
 * @property {string} [observacoes] - 
 */

/**
  * @template T
  * @typedef {import('..').DBAll<T>} DBAll<T>
*/

/**
 * @typedef {EditarItemInventario & {id, criador_id, empresa_id}} DadosEditarItemInventario
 */

/** @typedef {import('$lib/zod/schemas/estoque').EditarItemInventario} EditarItemInventario */