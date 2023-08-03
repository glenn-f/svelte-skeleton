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

export function detalharEstoque(dados) {

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