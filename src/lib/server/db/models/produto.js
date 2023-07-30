import { db, dbInsert, dbSelectOne, dbToggleSoftDelete, dbUpdate } from ".."

/**
 * Consulta todos os usuários associados à uma empresa da aplicação
 * @param {{empresa_id: number}} dados Dados da consulta sobre os usuários
 * @returns {DBAll<Produto>} Lista de usuários pertencentes à empresa 
 */
export function consultarProdutos(dados) {
  const { empresa_id } = dados
  try {
    const data = db.prepare("SELECT * FROM produto WHERE empresa_id = $empresa_id").all({ empresa_id })
    return { valid: true, data }
  } catch (e) {
    console.error(e)
    return { valid: false, message: "Erro desconhecido", code: 'DB_UNKNOWN' }
  }
}

/** //TODO JSDocs */
export function criarProduto(dados) {
  // const { empresa_id, produto_categoria_id, nome, titulo_codigo, criador_id } = dados
  try {
    const rs = dbInsert('produto', dados)
    if (rs.changes > 0) return { valid: true, data: rs.lastInsertRowid }
  } catch (e) {
    if (Object.getPrototypeOf(e)?.name === 'SqliteError') {
      console.log({ ErroSqlite: { code: e.code, message: e.message } })
    } else {
      console.log({ ErroDesconhecido: Object.getPrototypeOf(e)?.name ?? e })
    }
    console.error(e)
  }
  return { valid: false, message: "Erro desconhecido", code: 'DB_UNKNOWN' }
}

/** //TODO JSDocs */
export function editarProduto(dados) {
  try {
    const { id, nome, produto_categoria_id, titulo_codigo } = dados
    const rs = dbUpdate('produto', { nome, produto_categoria_id, titulo_codigo }, { id })
    if (rs.changes > 0) return { valid: true, data: null }
  } catch (e) {
    if (Object.getPrototypeOf(e)?.name === 'SqliteError') {
      console.log({ ErroSqlite: { code: e.code, message: e.message } })
    } else {
      console.log({ ErroDesconhecido: Object.getPrototypeOf(e)?.name ?? e })
    }
    console.error(e)
  }
  return { valid: false, message: "Erro desconhecido", code: 'DB_UNKNOWN' }
}

/** //TODO JSDocs */
export function alternarStatusProduto(dados) {
  const { id } = dados
  try {
    const res = dbToggleSoftDelete('produto', { id })
    if (res.changes == 0) { return { valid: false, message: "O status não foi alterado", code: "DB_UNKNOWN" } }
    const usuario = dbSelectOne('produto', ['delecao'], { id })
    if (usuario?.delecao) {
      return { valid: true, data: "Produto desativado com sucesso" }
    } else {
      return { valid: true, data: "Produto ativado com sucesso" }
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

/** //TODO JSDocs & Function */
export function detalharProduto(dados) {

}


//!JSDocs
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