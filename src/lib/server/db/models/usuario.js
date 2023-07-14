import { db, dbInsert, dbTransaction } from ".."

/**
 * Consulta todos os usuários associados à uma empresa da aplicação
 * @param {{eid: number}} dados Dados da consulta sobre os usuários
 * @returns {DBAll<UsuarioEmpresa>} Lista de usuários pertencentes à empresa 
 */
export function consultarUsuarios(dados) {
  const { eid } = dados
  try {
    const query = db.prepare("SELECT ue.gpe_id, ue.criacao associacao, ue.delecao desativacao, u.id, u.nome, u.email, u.tipo_usuario, u.criador_id, c.nome criador_nome \
FROM usuario u JOIN usuario_empresa ue ON ue.usuario_id = u.id LEFT JOIN usuario c ON c.id = u.criador_id WHERE ue.empresa_id = $eid")
    const data = query.all({ eid })
    return { valid: true, data }
  } catch (e) {
    return { valid: false, message: "Erro desconhecido", code: 'DB_UNKNOWN' }
  }
}

export function detalharUsuario(dados) {

}

export function editarUsuario(dados) {

}

export function alternarStatusUsuario(dados) {

}

/**
 * @typedef {Object} UsuarioEmpresa
 * @property {number} id - O ID do usuário
 * @property {number} gpe_id - O ID do GPE
 * @property {Date} associacao - Data de associação do usuário à empresa
 * @property {Date} [desativacao] - Data de desativação do usuário na empresa
 * @property {string} nome - O nome do usuário
 * @property {string} email - O endereço de e-mail do usuário
 * @property {number} tipo_usuario - O tipo de usuário na aplicação
 * @property {number} [criador_id] - O ID do criador do usuário
 * @property {string} [criador_nome] - O nome do criador do usuário
 */

/**
  * @template T
  * @typedef {import('..').DBAll<T>} DBAll<T>
*/