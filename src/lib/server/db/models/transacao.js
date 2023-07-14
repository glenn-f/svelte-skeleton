import { db, dbInsert, dbTransaction } from ".."

export function consultarTransacoes(dados) {

}

export function detalharTransacao(dados) {

}

export function editarTransacao(dados) {

}

export function alternarStatusTransacao(dados) {

}

/**
 * @typedef {Object} Transacao
 * @property {number} id -
 * @property {number} conta_id - 
 * @property {number} tipo_ff - 
 * @property {number} valor - 
 * @property {string} [observacoes] - 
 * @property {Date} [efetivacao] - 
 */

/**
  * @template T
  * @typedef {import('..').DBAll<T>} DBAll<T>
*/