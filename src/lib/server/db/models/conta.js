import { db, dbInsert, dbTransaction } from ".."

export function consultarContas(dados) {

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