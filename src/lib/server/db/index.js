import Database from 'better-sqlite3'
import path from 'node:path'
import url from 'url';
import { sqlTabela, sqlValor, sqlValorKV, sqlValorSelect } from './escape';
const env = await import("$env/dynamic/private").then(r => r.env).catch(e => process.env); //eslint-disable-line
const __filename = url.fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const DB_SQLITE_PATH = env.DB_SQLITE_PATH ?? path.join(__dirname, '../../../../data/sqlite.db')

//! DB Constants (para uso geral)
export const db = new Database(DB_SQLITE_PATH, { verbose: console.log })
export const begin = db.prepare('BEGIN');
export const commit = db.prepare('COMMIT');
export const rollback = db.prepare('ROLLBACK');

//! DB Helper Functions (apenas para casos gerais)
export function dbTransaction(func) {
  return function (...args) {
    begin.run();
    try {
      const result = func(...args);
      commit.run();
      return result
    } finally {
      if (db.inTransaction) rollback.run();
    }
  };
}

/**
 * Insere uma linha na tabela a partir dos dados recebicos
 * @param {string} tabela Nome da tabela no banco de dados
 * @param {string[]} campos Lista de colunas de seleção
 * @param {Object<string, any>} filtros Colunas de filtro da seleção no banco, chave-valor
 */
export function dbSelectOne(tabela, campos, filtros) {
  tabela = sqlTabela(tabela)
  const camposTemplate = sqlValorSelect(campos)
  const [valorFiltros, filtrosTemplate] = sqlValorKV(filtros, { sep: "AND" })
  const query = db.prepare(`SELECT ${camposTemplate} FROM ${tabela}` + (filtrosTemplate ? ` WHERE ${filtrosTemplate}` : ''))
  return query.get(valorFiltros)
}


/**
 * Insere uma linha na tabela a partir dos dados recebicos
 * @param {string} tabela Nome da tabela no banco de dados
 * @param {string[]} campos Lista de colunas de seleção
 * @param {Object<string, any>} filtros Colunas de filtro da seleção no banco, chave-valor
 */
export function dbSelectAll(tabela, campos, filtros) {
  tabela = sqlTabela(tabela)
  const camposTemplate = sqlValorSelect(campos)
  const [valorFiltros, filtrosTemplate] = sqlValorKV(filtros, { sep: "AND" })
  const sql = `SELECT ${camposTemplate} FROM ${tabela}` + (filtrosTemplate ? ` WHERE ${filtrosTemplate}` : '')
  const query = db.prepare(sql)
  return query.all(valorFiltros)
}

/**
 * Insere uma linha na tabela a partir dos dados recebicos
 * @param {string} tabela Nome da tabela no banco de dados
 * @param {Object<string, any>} campos Dados a serem inseridos na tabela, chave-valor
 */
export function dbInsert(tabela, campos) {
  tabela = sqlTabela(tabela)
  const [valores, colunas, templateValores] = sqlValor(campos)
  const mutation = db.prepare(`INSERT INTO ${tabela} (${colunas}) VALUES (${templateValores})`)
  return mutation.run(valores)
}

/**
 * Atualiza o banco de dados de acordo com o filtro e os dados passados
 * @param {string} tabela Nome da tabela no banco de dados
 * @param {Object<string, any>} campos Colunas a serem atualizados no banco, chave-valor
 * @param {Object<string, any>} filtros Colunas de filtro da atualização no banco, chave-valor
 */
export function dbUpdate(tabela, campos, filtros) {
  tabela = sqlTabela(tabela)
  const [dadosValores, dadosTemplate] = sqlValorKV(campos, { opNull: "=" })
  const [filtroValores, filtroTemplate] = sqlValorKV(filtros, { sep: "AND" })
  const mutation = db.prepare(`UPDATE ${tabela} SET ${dadosTemplate} WHERE ${filtroTemplate}`)
  return mutation.run({ ...dadosValores, ...filtroValores })
}

/**
 * Performa uma alternação no soft delete na tabela de acordo com os filtros passados
 * @param {string} tabela Nome da tabela no banco de dados
 * @param {Object<string, any>} filtros Colunas de filtro do soft delete, chave-valor
 */
export function dbToggleSoftDelete(tabela, filtros) {
  tabela = sqlTabela(tabela)
  const [filtroValores, filtroTemplate] = sqlValorKV(filtros, { sep: "AND" })
  const agora = Date.now()
  const sql = `UPDATE ${tabela} SET delecao = (CASE WHEN delecao IS NULL THEN $agora ELSE NULL END) WHERE ${filtroTemplate}`
  // console.log(sql)
  const query = db.prepare(sql)
  return query.run({ ...filtroValores, agora })
}
//TODOs
//TODO export function dbHardDelete()

//! Definição de Tipos Genéricos do Banco de Dados
/**
 * @template T - Tipo dos dados do resultado.
 * @typedef {Object.<keyof T, string[] | undefined>} FieldErrors<T>
 */
/**
 * @template T - Tipo dos dados do resultado.
 * @typedef {Object} ResultSetInvalid<T>
 * @property {false} valid - Validade do resultado da execução SQL
 * @property {FieldErrors<T>} [fieldErrors] - Listagem de erros por campo da tabela
 * @property {string} message - Descrição geral do erro ocorrido
 * @property {string} code - Código do erro ocorrido
 */
/**
 * @template T - Tipo dos dados do resultado.
 * @typedef {Object} ResultSetValid<T>
 * @property {true} valid - Validade do resultado da execução SQL
 * @property {T} data - Dados válidos do resultado da execução SQL
 */
/**
 * @template T - Tipo dos dados do resultado.
 * @typedef {ResultSetValid<T[]> | ResultSetInvalid<T>} DBAll<T>
 */
/**
 * @template T - Tipo dos dados do resultado.
 * @typedef {ResultSetValid<T> | ResultSetInvalid<T>} DBGet<T>
 */

/**
 * @template T - Tipo dos dados do resultado.
 * @typedef {ResultSetValid<number> | ResultSetInvalid<T>} DBRun<T>
 */

/**
 * @template T - Tipo dos dados do resultado.
 * @typedef {ResultSetValid<string> | ResultSetInvalid<T>} DBSoftDelete<T>
 */

