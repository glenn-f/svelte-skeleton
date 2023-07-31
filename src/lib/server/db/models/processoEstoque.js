import { db, dbSelectAll } from ".."

export function consultarEntradas(dados) {
  const { empresa_id } = dados
  try {
    const data = db.prepare("SELECT id,responsavel_id,tipo_pe,delecao FROM pe WHERE empresa_id = $empresa_id").all({ empresa_id })
    return { valid: true, data }
  } catch (e) {
    console.error(e)
    return { valid: false, message: "Erro desconhecido", code: 'DB_UNKNOWN' }
  }
}

/**
 * @typedef {Object} Entrada
 * @property {number} id -
 * @property {number} criador_id - 
 * @property {number} empresa_id - 
 * @property {number} [responsavel_id] - 
 * @property {number} tipo_pe - 
 * @property {number} [observacoes] - 
 * @property {number} criacao - 
 * @property {number} [alteracao] - 
 * @property {number} [delecao] - 
 */

/**
  * @template T
  * @typedef {import('..').DBAll<T>} DBAll<T>
*/