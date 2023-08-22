import { currencyToInt, percToInt } from "$lib/types"
import { dbInsert, dbSelectAll, dbSelectOne, dbToggleSoftDelete, dbUpdate } from ".."

export function consultarRegrasTributo(dados) {
  const { empresa_id } = dados
  try {
    const data = dbSelectAll('regra_tributo', ['id', 'nome', 'descricao', 'CAST(taxa_fixa AS REAL)/10000 taxa_fixa', 'delecao'], { empresa_id })
    return { valid: true, data }
  } catch (e) {
    console.error(e)
    return { valid: false, message: "Erro desconhecido", code: 'DB_UNKNOWN' }
  }
}

export function criarRegraTributo(dados) {
  try {
    let { taxa_fixa, bonus_fixo, ...campos } = dados
    taxa_fixa = percToInt(taxa_fixa)
    const { changes, lastInsertRowid } = dbInsert('regra_tributo', { taxa_fixa, bonus_fixo, ...campos })
    if (changes > 0) {
      return { valid: true, data: lastInsertRowid }
    } else {
      return { valid: false, message: "Regra de Tributo não foi criada", code: "DB_UNKNOWN" }
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

export function editarRegraTributo(dados) {
  try {
    let { id, taxa_fixa, bonus_fixo, ...campos } = dados
    taxa_fixa = percToInt(taxa_fixa)
    bonus_fixo = currencyToInt(bonus_fixo)
    const { changes } = dbUpdate('regra_tributo', { taxa_fixa, bonus_fixo, ...campos }, { id })
    if (changes > 0) {
      return { valid: true, data: null }
    } else {
      return { valid: false, message: "Nenhum dado foi atualizado", code: "DB_UNKNOWN" }
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

export function alternarStatusRegraTributo(dados) {
  const { id } = dados
  try {
    const res = dbToggleSoftDelete('regra_tributo', { id })
    if (res.changes == 0) { return { valid: false, message: "O status não foi alterado", code: "DB_UNKNOWN" } }
    const r = dbSelectOne('regra_tributo', ['delecao'], { id })
    if (r?.delecao) {
      return { valid: true, data: "Regra de Tributo desativada com sucesso" }
    } else {
      return { valid: true, data: "Regra de Tributo ativada com sucesso" }
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
