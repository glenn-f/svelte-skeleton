import { db, dbInsert, dbTransaction } from ".."

/**
 * Consulta todos os usuários associados à uma empresa da aplicação
 * @param {{eid: number}} dados Dados da consulta sobre os usuários
 * @returns {DBAll<Produto>} Lista de usuários pertencentes à empresa 
 */
export function consultarProdutos(dados) {
  const { eid } = dados
  try {
    const query = db.prepare("SELECT * FROM produto WHERE empresa_id = $eid")
    /** @type {Produto[]} Listagem de produtos */
    const data = query.all({ eid })
    return { valid: true, data }
  } catch (e) {
    return { valid: false, message: "Erro desconhecido", code: 'DB_UNKNOWN' }
  }
}

export function detalharProduto(dados) {

}

export function editarProduto(dados) {

}

export function alternarStatusProduto(dados) {

}

/**
 * @typedef {Object} Produto
 * @property {number} id - O ID do produto
 * @property {number} empresa_id - O ID da empresa
 * @property {number} [produto_categoria_id] - O ID da categoria deste produto
 * @property {string} nome - O nome do produto
 * @property {string} titulo_codigo - O título do código de identificação do produto (ex: IMEI, Serial, SN, etc)
 * @property {string} config_json - Bloco de Configuração de Opções de Identificação Adicionais (ex: Lote, Marca, etc)
 * @property {Date} criacao - Data de inserção deste registro no banco de dados
 * @property {Date} [delecao] - Data de desativação deste registro no banco de dados
 */

/**
  * @template T
  * @typedef {import('..').DBAll<T>} DBAll<T>
*/