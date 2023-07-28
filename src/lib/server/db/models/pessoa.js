import { db, dbInsert, dbTransaction } from ".."

/**
 * Consulta todos os usuários associados à uma empresa da aplicação
 * @param {{empresa_id: number}} dados Dados da consulta sobre os usuários
 * @returns {DBAll<Pessoa>} Lista de usuários pertencentes à empresa 
 */
export function consultarPessoas(dados, rep) {
  const { empresa_id } = dados
  try {
    const query = db.prepare("SELECT * FROM pessoa WHERE empresa_id = $empresa_id" + (rep !== undefined ? " AND rep = $rep" : ""))
    const data = query.all({ empresa_id, rep })
    return { valid: true, data }
  } catch (e) {
    return { valid: false, message: "Erro desconhecido", code: 'DB_UNKNOWN' }
  }
}

export function detalharPessoa(dados) {

}

export function editarPessoa(dados) {

}

export function alternarStatusPessoa(dados) {

}

/**
 * @typedef {Object} Pessoa
 * @property {number} id - O ID da pessoa
 * @property {number} empresa_id - O ID da empresa
 * @property {number} criador_id - O ID do usuário que criou esta pessoa
 * @property {number} tipo_pessoa - O Tipo de Pessoa
 * @property {number} rep - O Tipo de Relacionamento Empresa-Pessoa
 * @property {string} nome - O nome da pessoa
 * @property {string} [email] - 
 * @property {string} [cpf] - 
 * @property {string} [cnpj] - 
 * @property {string} [rg] - 
 * @property {string} [apelido] - 
 * @property {string} [endereco] - 
 * @property {string} [cep] - 
 * @property {string} [sexo] - 
 * @property {Date} [dn] - 
 * @property {Date} criacao - Data de inserção deste registro no banco de dados
 * @property {Date} [delecao] - Data de desativação deste registro no banco de dados
 */

/**
  * @template T
  * @typedef {import('..').DBAll<T>} DBAll<T>
*/