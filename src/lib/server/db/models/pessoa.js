import { dbInsert, dbSelectAll, dbSelectOne, dbToggleSoftDelete, dbUpdate } from ".."

/**
 * Consulta todos os usuários associados à uma empresa da aplicação
 * @param {{empresa_id: number}} dados Dados da consulta sobre os usuários
 * @returns {DBAll<Pessoa>} Lista de usuários pertencentes à empresa 
 */
export function consultarPessoas(dados, rep) {
  const { empresa_id } = dados
  try {
    const data = dbSelectAll('pessoa', ['*'], { empresa_id, rep })
    console.log(data)
    return { valid: true, data }
  } catch (e) {
    console.error(e)
    return { valid: false, message: "Erro desconhecido", code: 'DB_UNKNOWN' }
  }
}

export function criarPessoa(dados) {
  try {
    const { changes, lastInsertRowid } = dbInsert('pessoa', dados)
    if (changes > 0) {
      return { valid: true, data: lastInsertRowid }
    } else {
      return { valid: false, message: "Pessoa não foi criada", code: "DB_UNKNOWN" }
    }
  } catch (e) {
    if (Object.getPrototypeOf(e)?.name === 'SqliteError') {
      if (e.code == 'SQLITE_CONSTRAINT_UNIQUE') {
        return { valid: false, message: 'Houve problemas em alguns campos', fieldMessage: { email: ['Este e-mail já está em uso.'] } }
      } else {
        console.log({ ErroSqlite: { code: e.code, message: e.message } })
      }
    } else {
      console.log({ ErroDesconhecido: Object.getPrototypeOf(e)?.name ?? e })
    }
    console.error(e)
    return { valid: false, message: 'Erro no servidor', code: "DB_UNKNOWN" }
  }
}

export function editarPessoa(dados) {
  try {
    const { id, ...campos } = dados
    const { changes } = dbUpdate('pessoa', campos, { id })
    if (changes > 0) {
      return { valid: true, data: null }
    } else {
      return { valid: false, message: "Nenhum dado foi atualizado", code: "DB_UNKNOWN" }
    }
  } catch (e) {
    if (Object.getPrototypeOf(e)?.name === 'SqliteError') {
      if (e.code == 'SQLITE_CONSTRAINT_UNIQUE') {
        return { valid: false, message: 'Houve problemas em alguns campos', fieldMessage: { email: ['Este e-mail já está em uso.'] } }
      } else {
        console.log({ ErroSqlite: { code: e.code, message: e.message } })
      }
    } else {
      console.log({ ErroDesconhecido: Object.getPrototypeOf(e)?.name ?? e })
    }
    console.error(e)
    return { valid: false, message: 'Erro no servidor', code: "DB_UNKNOWN" }
  }
}

//TODO
export function alternarStatusPessoa(dados) {
  const { id } = dados
  try {
    const res = dbToggleSoftDelete('pessoa', { id })
    if (res.changes == 0) { return { valid: false, message: "O status não foi alterado", code: "DB_UNKNOWN" } }
    const r = dbSelectOne('pessoa', ['delecao'], { id })
    if (r?.delecao) {
      return { valid: true, data: "Pessoa desativada com sucesso" }
    } else {
      return { valid: true, data: "Pessoa ativada com sucesso" }
    }
  } catch (e) {
    if (Object.getPrototypeOf(e)?.name === 'SqliteError') {
      console.log({ ErroSqlite: { code: e.code, message: e.message } })
    } else {
      console.log({ ErroDesconhecido: Object.getPrototypeOf(e)?.name ?? e })
    }
    console.error(e)
    return { valid: false, message: 'Erro no servidor', code: "DB_UNKNOWN" }
  }
}

//TODO
export function detalharPessoa(dados) {

}

//!JSDocs
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