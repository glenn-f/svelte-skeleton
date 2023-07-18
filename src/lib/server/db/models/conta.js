import { db, dbInsert, dbTransaction } from ".."

/**
 * Consulta todas as contas associados à uma empresa da aplicação
 * @param {{eid: number}} dados Dados da consulta sobre as contas
 * @returns {DBAll<Conta>} Lista de contas pertencentes à empresa 
 */
export function consultarContas(dados) {
  const { eid } = dados
  try {
    const query = db.prepare("SELECT * FROM conta WHERE empresa_id = $eid")
    /** @type {Conta[]} Listagem de produtos */
    const data = query.all({ eid })
    return { valid: true, data }
  } catch (e) {
    return { valid: false, message: "Erro desconhecido", code: 'DB_UNKNOWN' }
  }
}

export function detalharConta(dados) {

}

export function editarConta(dados) {

}

export function alternarStatusConta(dados) {

}

/**
 * @typedef {Object} Conta
 * @property {number} id - O ID da pessoa
 * @property {number} empresa_id - O ID da empresa
 * @property {string} nome - O nome da conta
 * @property {number} saldo - O saldo da conta 
 */

/**
  * @template T
  * @typedef {import('..').DBAll<T>} DBAll<T>
*/