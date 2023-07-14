import { db, dbInsert, dbTransaction } from ".."

export function consultarEstoques(dados) {

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