import { dbInsert, dbSelectAll, dbSelectOne, dbToggleSoftDelete, dbUpdate } from ".."

export function consultarContas(dados) {
  const { empresa_id } = dados
  try {
    const data = dbSelectAll('conta', ['id','nome','delecao','CAST(saldo AS REAL)/10000 saldo'], { empresa_id })
    return { valid: true, data }
  } catch (e) {
    console.error(e)
    return { valid: false, message: "Erro desconhecido", code: 'DB_UNKNOWN' }
  }
}

export function criarConta(dados) {
  try {
    const { changes, lastInsertRowid } = dbInsert('conta', dados)
    if (changes > 0) {
      return { valid: true, data: lastInsertRowid }
    } else {
      return { valid: false, message: "Conta não foi criada", code: "DB_UNKNOWN" }
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

export function editarConta(dados) {
  try {
    const { id, ...campos } = dados
    const { changes } = dbUpdate('conta', campos, { id })
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
export function alternarStatusConta(dados) {
  const { id } = dados
  try {
    const res = dbToggleSoftDelete('conta', { id })
    if (res.changes == 0) { return { valid: false, message: "O status não foi alterado", code: "DB_UNKNOWN" } }
    const r = dbSelectOne('conta', ['delecao'], { id })
    if (r?.delecao) {
      return { valid: true, data: "Conta desativada com sucesso" }
    } else {
      return { valid: true, data: "Conta ativada com sucesso" }
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
export function detalharConta(dados) {

}

/**
 * @typedef {Object} Conta
 * @property {number} id - O ID da conta
 * @property {number} empresa_id - O ID da empresa
 * @property {string} nome - O nome da conta
 * @property {number} saldo - O saldo da conta 
 */

/**
  * @template T
  * @typedef {import('..').DBAll<T>} DBAll<T>
*/