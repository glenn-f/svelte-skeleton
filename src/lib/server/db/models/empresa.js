import { db, dbInsert, dbTransaction } from ".."

export function consultarEmpresas(dados) {

}

export function detalharEmpresa(dados) {

}

export function editarEmpresa(dados) {

}

export function alternarStatusEmpresa(dados) {

}

/**
 * @typedef {Object} Empresa
 * @property {number} id - O ID da pessoa
 * @property {number} dono_id - O ID da empresa
 * @property {string} nome_fantasia - O nome da pessoa
 * @property {string} razao_social - 
 * @property {string} cnpj - 
 * @property {string} inscricao_estadual - 
 * @property {string} codigo_regime_tributario - 
 * @property {string} pais - 
 * @property {string} uf - 
 * @property {string} municipio - 
 * @property {string} bairro - 
 * @property {string} cep - 
 * @property {string} endereco - 
 * @property {string} telefone - 
 * @property {Date} criacao - Data de inserção deste registro no banco de dados
 * @property {Date} [delecao] - Data de desativação deste registro no banco de dados
 */

/**
  * @template T
  * @typedef {import('..').DBAll<T>} DBAll<T>
*/