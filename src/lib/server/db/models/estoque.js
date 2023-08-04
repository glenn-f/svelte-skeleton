import { mapCausasErro } from "$lib/globals";
import { handleAnyError } from "$lib/helpers";
import { intToCurrency } from "$lib/types";
import { db } from "..";

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
    const data = db.prepare("SELECT pe.id entrada_id,pe.criacao data_entrada,fe.tipo_fe forma_entrada,e.id,e.produto_id,e.qntd,e.custo/10000 custo,e.preco_unitario/10000 preco_unitario,e.condicao,e.origem,e.codigo,e.estado,e.delecao,p.nome AS p_nome FROM estoque e LEFT JOIN fe ON fe.estoque_id = e.id AND fe.tipo_fe <= 100 JOIN produto p ON e.produto_id = p.id LEFT JOIN pe ON pe.id = fe.pe_id WHERE p.empresa_id = $empresa_id AND e.qntd > 0").all({ empresa_id })
    return { valid: true, data }
  } catch (e) {
    console.error(e)
    return { valid: false, message: "Erro desconhecido", code: 'DB_UNKNOWN' }
  }
}

function custosToMap(custos) {
  const mapa = new Map();
  for (let i = 0; i < custos.length; i++) {
    const { pe_id, tipo_pe, criacao, tipo_fe, qntd, fe_observacoes, valor, classe_fc, tipo_fc, fc_observacoes } = custos[i];

    if (!mapa.has(pe_id)) {
      mapa.set(pe_id, { pe_id, tipo_pe, criacao, tipo_fe, qntd, fe_observacoes, contabil: [{ valor, classe_fc, tipo_fc, fc_observacoes }] })
    } else {
      mapa.get(pe_id).contabil.push({ valor, classe_fc, tipo_fc, fc_observacoes })
    }
  }
  return Array.from(mapa.values())
}

export function detalharEstoque(dados) {
  const { empresa_id, id } = dados
  try {
    const data = db.prepare("SELECT e.*, e.custo/10000 custo, e.preco_unitario/10000 preco_unitario, p.nome produto_nome, p.titulo_codigo, pc.nome categoria, criador.nome criador FROM estoque e \
LEFT JOIN produto p ON p.id = e.produto_id LEFT JOIN produto_categoria pc ON pc.id = p.produto_categoria_id LEFT JOIN usuario criador ON criador.id = e.criador_id \
WHERE e.id = $id").get({ id })
    const pes = db.prepare("SELECT pe.id pe_id,pe.tipo_pe,pe.criacao,fe.tipo_fe,fe.qntd,fe.observacoes fe_observacoes,fc_fe.valor_inicial/10000 valor,fc.classe_fc,fc.tipo_fc,fc.observacoes fc_observacoes FROM pe LEFT JOIN fe ON pe.id = pe_id LEFT JOIN fc_fe ON fc_fe.fe_id = fe.id LEFT JOIN fc ON fc.id = fc_fe.fc_id WHERE fe.estoque_id = $id").all({ id })
    data.pes = custosToMap(pes)
    console.log(data.pes)
    return { valid: true, data }

  } catch (e) {
    const { errorType, cause, fieldErrors, message } = handleAnyError(e)
    return { valid: false, fieldErrors, message, errorType, code: cause }
  }
}

export function editarEstoque(dados) {

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