import { intToPerc, percToInt } from "$lib/types";
import { begin, commit, db, dbInsert, dbSelectOne, dbToggleSoftDelete, dbUpdate, rollback } from "..";

function cfToMap(cfs) {
  const mapa = new Map();
  for (let i = 0; i < cfs.length; i++) {
    const { id, conta_id, nome, pode_parcelar, pode_receber, pode_pagar, delecao, parcela, forma_transacao_id } = cfs[i];
    const taxa_encargo = intToPerc(cfs[i].taxa_encargo)
    if (!pode_parcelar) {
      mapa.set(id, { id, conta_id, nome, pode_parcelar, pode_receber, pode_pagar, delecao, taxa_encargo, forma_transacao_id })
    } else {
      if (!mapa.has(id)) {
        mapa.set(id, { id, conta_id, nome, pode_parcelar, pode_receber, pode_pagar, delecao, parcelamentos: [{ parcela, taxa_encargo, forma_transacao_id }] })
      } else {
        mapa.get(id).parcelamentos.push({ parcela, taxa_encargo, forma_transacao_id })
      }
    }
  }
  return Array.from(mapa.values())
}

export function consultarContaFormas(dados) {
  const { empresa_id } = dados
  try {
    const data = db.prepare("SELECT cf.*, ft.parcela, ft.taxa_encargo FROM conta_forma cf JOIN conta c ON c.id = cf.conta_id LEFT JOIN forma_transacao ft ON ft.conta_forma_id = cf.id AND ft.delecao IS NULL WHERE c.empresa_id = $empresa_id")
      .all({ empresa_id })
    const mapa = cfToMap(data)
    return { valid: true, data: mapa }
  } catch (e) {
    console.error(e)
    return { valid: false, message: "Erro desconhecido", code: 'DB_UNKNOWN' }
  }
}

export function consultarContaFormasEntrada(dados) {
  const { empresa_id } = dados
  try {
    const data = db.prepare("SELECT cf.*, ft.id forma_transacao_id, ft.parcela, ft.taxa_encargo FROM conta_forma cf JOIN conta c ON c.id = cf.conta_id LEFT JOIN forma_transacao ft ON ft.conta_forma_id = cf.id AND ft.delecao IS NULL WHERE c.empresa_id = $empresa_id AND pode_pagar = 1")
      .all({ empresa_id })
    const mapa = cfToMap(data)
    return { valid: true, data: mapa }
  } catch (e) {
    console.error(e)
    return { valid: false, message: "Erro desconhecido", code: 'DB_UNKNOWN' }
  }
}

export function criarContaForma(dados) {
  try {
    begin.run();
    let { taxa_encargo, parcelamentos, criador_id, pode_parcelar, ...campos } = dados
    const resContaForma = dbInsert('conta_forma', { pode_parcelar, criador_id, ...campos })
    if (resContaForma.changes === 0) throw new Error("Não foi possível criar a conta_forma")

    const conta_forma_id = resContaForma.lastInsertRowid
    if (!pode_parcelar) { parcelamentos = [{ taxa_encargo, parcela: 0 }] }

    for (let i = 0; i < parcelamentos.length; i++) {
      const taxa_encargo = percToInt(parcelamentos[i].taxa_encargo)
      const parcela = parcelamentos[i].parcela
      const resFormaTransacao = dbInsert('forma_transacao', { conta_forma_id, criador_id, taxa_encargo, parcela })
      if (resFormaTransacao.changes === 0) throw new Error("Não foi possível criar a forma_transacao")
    }

    commit.run();
    return { valid: true, data: conta_forma_id }
  } catch (e) {
    rollback.run();
    if (Object.getPrototypeOf(e)?.name === 'SqliteError') {
      console.log({ ErroSqlite: { code: e.code, message: e.message } })
    } else {
      console.log({ ErroDesconhecido: Object.getPrototypeOf(e)?.name ?? e })
    }
    console.error(e)
    return { valid: false, message: 'Erro no servidor', code: "DB_UNKNOWN" }
  }
}

export function editarContaForma(dados) {
  try {
    begin.run();
    let { id: conta_forma_id, taxa_encargo, parcelamentos, pode_parcelar, criador_id, ...campos } = dados
    const resContaForma = dbUpdate('conta_forma', { pode_parcelar, ...campos }, { id: conta_forma_id })
    if (resContaForma.changes === 0) throw new Error("Não foi possível atualizar a conta_forma")

    if (!pode_parcelar) { parcelamentos = [{ taxa_encargo, parcela: 0 }] }
    const parcelas = parcelamentos.map((v) => v.parcela).join(', ')
    const agora = Date.now()

    for (let i = 0; i < parcelamentos.length; i++) {
      const taxa_encargo = percToInt(parcelamentos[i].taxa_encargo)
      const parcela = parcelamentos[i].parcela
      const id = db.prepare("SELECT id FROM forma_transacao WHERE conta_forma_id = $conta_forma_id AND parcela = $parcela").pluck().get({ conta_forma_id, parcela })
      const resFormaTransacao = id ? dbUpdate('forma_transacao', { taxa_encargo, delecao: null }, { id }) :
        dbInsert('forma_transacao', { conta_forma_id, parcela, taxa_encargo, criador_id })
      if (resFormaTransacao.changes === 0) throw new Error("Não foi possível atualizar a forma_transacao")
    }

    db.prepare(`UPDATE forma_transacao SET delecao = $agora WHERE conta_forma_id = $conta_forma_id AND parcela NOT IN (${parcelas})`).run({ agora, conta_forma_id })

    commit.run();
    return { valid: true, data: conta_forma_id }
  } catch (e) {
    rollback.run();
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
export function alternarStatusContaForma(dados) {
  const { id } = dados
  try {
    const res = dbToggleSoftDelete('conta_forma', { id })
    if (res.changes == 0) { return { valid: false, message: "O status não foi alterado", code: "DB_UNKNOWN" } }
    const r = dbSelectOne('conta_forma', ['delecao'], { id })
    if (r?.delecao) {
      return { valid: true, data: "Forma de Transação desativada com sucesso" }
    } else {
      return { valid: true, data: "Forma de Transação ativada com sucesso" }
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
export function detalharContaForma(dados) {

}

/**
 * @typedef {Object} ContaForma
 * @property {number} id - O ID da conta_forma
 * @property {number} empresa_id - O ID da empresa
 * @property {string} nome - O nome da conta_forma
 * @property {number} pode_receber - Permissão para receber valores
 * @property {number} pode_pagar - Permissão para pagar valores
 */

/**
  * @template T
  * @typedef {import('..').DBAll<T>} DBAll<T>
*/