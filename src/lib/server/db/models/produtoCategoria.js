import { db, dbInsert, dbTransaction } from ".."

/**
 * Consulta todos os usuários associados à uma empresa da aplicação
 * @param {{eid: number}} dados Dados da consulta sobre os usuários
 * @returns {DBAll<ProdutoCategoria>} Lista de usuários pertencentes à empresa 
 */
export function consultarProdutoCategorias(dados) {
  const { eid } = dados
  try {
    const query = db.prepare("SELECT * FROM produto_categoria WHERE empresa_id = $eid")
    const data = query.all({ eid })
    return { valid: true, data }
  } catch (e) {
    return { valid: false, message: "Erro desconhecido", code: 'DB_UNKNOWN' }
  }
}

export function detalharProdutoCategoria(dados) {

}

export function editarProdutoCategoria(dados) {

}

export function alternarStatusProdutoCategoria(dados) {

}

/**
 * @typedef {Object} ProdutoCategoria
 * @property {number} id - O ID da categoria de produto
 * @property {number} empresa_id - O ID da empresa
 * @property {string} nome - O nome da categoria de produto
 * @property {Date} criacao - Data de inserção deste registro no banco de dados
 * @property {Date} [delecao] - Data de desativação deste registro no banco de dados
 */

/**
  * @template T
  * @typedef {import('..').DBAll<T>} DBAll<T>
*/