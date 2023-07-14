import { db, dbInsert, dbTransaction } from ".."

export function consultarEstoques(dados) {
  const { eid } = dados
  try {
    const query = db.prepare("SELECT e.*, p.nome p_nome, p.titulo_codigo, p.produto_categoria_id FROM estoque e JOIN produto p ON p.id = e.produto_id WHERE p.empresa_id = $eid")
    const data = query.all({ eid })
    return { valid: true, data }
  } catch (e) {
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