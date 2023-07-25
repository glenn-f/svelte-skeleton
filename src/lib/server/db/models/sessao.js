import { db, dbInsert } from ".."

/**
 * Cria uma sessão no banco de dados e retorna seu ID.
 * @param {{id: string expiracao: number usuarioId:number}} dados Dados da sessão
 * @returns {string | undefined} ID da sessão no banco
 */
export function criarSessao(dados) {
  const { id, expiracao, usuarioId } = dados
  try {
    const { changes, lastInsertRowid } = dbInsert('sessao', { id, expiracao, usuario_id: usuarioId })
    return changes ? lastInsertRowid : undefined
  } catch (e) {
    console.error(e)
    return undefined
  }
}

/**
 * Retorna dados da sessão do usuário, se existir no banco de dados
 * @param {{id: string}} dados Dados da sessão (SID)
 * @returns {SessaoUsuarioEmpresa | undefined} Dados da sessão + usuário e empresa
 */
export function detalharSessao(dados) {
  const { id } = dados
  try {
    const query = db.prepare("\
SELECT s.id sid, s.expiracao expiracao, u.id uid, u.nome nome, u.email, u.tipo_usuario perm, ue.empresa_id, ue.pessoa_id, ue.gpe_id \
FROM sessao s LEFT JOIN usuario u ON u.id = s.usuario_id LEFT JOIN usuario_empresa ue ON ue.usuario_id = s.usuario_id WHERE s.id = $id")
    const rs = query.get({ id })
    return rs ? rs : undefined
  } catch (e) {
    console.error(e)
    return undefined
  }
}

/**
 * Apaga a sessão se existir
 * @param {string} id ID da sessão a ser apagada (HexString)
 * @returns {number} Quantidade de sessões apagadas
 */
export function apagarSessao(id) {
  try {
    const query = db.prepare('DELETE FROM sessao WHERE id = $id')
    const { changes } = query.run({ id })
    return changes
  } catch (e) {
    console.error(e)
    return 0
  }
}

/**
 * Apaga as sessões que expiram antes da data recebida.
 * @param {number} now Data em millisegundos: limite de expiração das sessões que devem ser apagadas
 * @returns {number} Quantidade de sessões apagadas
 */
export function apagarSessoesExpiradas(now) {
  try {
    const query = db.prepare('DELETE FROM sessao WHERE expiracao < $now')
    const { changes } = query.run({ now })
    return changes
  } catch (e) {
    console.error(e)
    return 0
  }
}

/**
 * Apaga todas a sessões de um usuário
 * @param {number} id ID do usuário
 * @returns {string[]} IDs das sessões apagadas do banco
 */
export function apagarSessoesUsuario(id) {
  try {
    const query = db.prepare('SELECT id FROM sessao WHERE usuario_id = $id')
    const sessoes = query.pluck().all({ id })
    const mutateDelete = db.prepare('DELETE FROM sessao WHERE usuario_id = $id')
    const resDelete = mutateDelete.run({ id })
    if (resDelete.changes < sessoes.length) console.log(`UID ${id}: ${resDelete.changes} de ${sessoes.length} sessões apagadas.`)
    return sessoes
  } catch (e) {
    console.error(e)
    return []
  }
}

/**
 * @typedef {Object} SessaoUsuarioEmpresa
 * @property {string} sid ID da sessão do usuário
 * @property {number} expiracao Data e hora do final da Sessão (Unix Milissegundos)
 * @property {number} uid ID do usuário
 * @property {string} nome Nome do usuário
 * @property {string} email Email do usuário
 * @property {number} tipo_usuario Tipo de usuário na aplicação
 * @property {number} [empresa_id] Empresa ativa na sessão do usuário
 * @property {number} [pessoa_id] ID da pessoa do usuário na empresa
 * @property {number} [gpe_id] Grupo de permissão do usuário na empresa
 */

/**
  * @template T
  * @typedef {import('..').DBGet<T>} DBGet<T>
*/