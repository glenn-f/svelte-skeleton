import { db, dbInsert, dbSelectOne, dbToggleSoftDelete, dbUpdate } from ".."

/**
 * Consulta todos os usuários associados à uma empresa da aplicação
 * @param {{empresa_id: number}} dados Dados da consulta sobre os usuários
 * @returns {DBAll<ProdutoCategoria>} Lista de usuários pertencentes à empresa 
 */
export function consultarProdutoCategorias(dados) {
  const { empresa_id } = dados
  try {
    const data = db.prepare("SELECT * FROM produto_categoria WHERE empresa_id = $empresa_id").all({ empresa_id })
    return { valid: true, data }
  } catch (e) {
    return { valid: false, message: "Erro desconhecido", code: 'DB_UNKNOWN' }
  }
}

/** //TODO JSDocs */
export function criarProdutoCategoria(dados) {
  try {
    const rs = dbInsert('produto_categoria', dados)
    if (rs.changes > 0) {
      return { valid: true, data: rs.lastInsertRowid }
    }
  } catch (e) {
    if (Object.getPrototypeOf(e)?.name === 'SqliteError') {
      if (e.code == 'SQLITE_CONSTRAINT_UNIQUE') {
        return { valid: false, fieldErrors: { nome: "Este nome já está em uso" }, message: "Alguns campos foram rejeitados", code: 'DB_UNIQUE' }
      } else {
        console.log({ ErroSqlite: { code: e.code, message: e.message } })
      }
    } else {
      console.log({ ErroDesconhecido: Object.getPrototypeOf(e)?.name ?? e })
    }
    console.error(e)
  }
  return { valid: false, message: "Erro desconhecido", code: 'DB_UNKNOWN' }
}

/** //TODO JSDocs */
export function editarProdutoCategoria(dados) {
  try {
    const { id, nome } = dados
    const rs = dbUpdate('produto_categoria', { nome }, { id })
    if (rs.changes > 0) {
      return { valid: true, data: null }
    }
  } catch (e) {
    if (Object.getPrototypeOf(e)?.name === 'SqliteError') {
      if (e.code == 'SQLITE_CONSTRAINT_UNIQUE') {
        return { valid: false, fieldErrors: { nome: "Este nome já está em uso" }, message: "Duplicidade encontrada", code: 'DB_UNIQUE' }
      } else {
        console.log({ ErroSqlite: { code: e.code, message: e.message } })
      }
    } else {
      console.log({ ErroDesconhecido: Object.getPrototypeOf(e)?.name ?? e })
    }
    console.error(e)
  }
  return { valid: false, message: "Erro desconhecido", code: 'DB_UNKNOWN' }
}

/** //TODO JSDocs */
export function alternarStatusProdutoCategoria(dados) {
  const { id } = dados
  try {
    const res = dbToggleSoftDelete('produto_categoria', { id })
    if (res.changes == 0) { return { valid: false, message: "O status não foi alterado", code: "DB_UNKNOWN" } }
    const usuario = dbSelectOne('produto_categoria', ['delecao'], { id })
    if (usuario?.delecao) {
      return { valid: true, data: "Categoria desativada com sucesso" }
    } else {
      return { valid: true, data: "Categoria ativada com sucesso" }
    }
  } catch (e) {
    if (Object.getPrototypeOf(e)?.name === 'SqliteError') {
      console.log({ ErroSqlite: { code: e.code, message: e.message } })
    } else {
      console.log({ ErroDesconhecido: Object.getPrototypeOf(e)?.name ?? e })
    }
    return { valid: false, message: 'Erro no servidor', code: "DB_UNKNOWN" }
  }
}

/** //TODO JSDocs & Function */
export function detalharProdutoCategoria(dados) {

}

//!JSDocs
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