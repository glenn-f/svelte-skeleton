import { db, dbSelectAll } from ".."

export function consultarEstoques(dados) {
  const { empresa_id } = dados
  try {
    const data = db.prepare("SELECT e.id,e.qntd,e.produto_id,e.custo,e.preco_unitario,e.estado,e.condicao,e.codigo,e.delecao FROM estoque e JOIN produto p ON e.produto_id = p.id WHERE p.empresa_id = $empresa_id AND e.qntd > 0").all({ empresa_id })
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