import { db, dbInsert, dbTransaction } from ".."

/**
 * @param {{nome:string email:string senha:string criador_id:number empresa_id:number gpe_id:number}} dados
 * @returns {number} usuario_empresa.id
 */
export function criarUsuarioEmpresa({ nome, email, senha, criador_id, empresa_id, gpe_id }) {
  begin.run();
  try {
    senha = encriptar(senha)
    const tipo_usuario = 0 // usuário criado para uma empresa tem nível de permissão 0
    const resUsuario = dbInsert('usuario', { nome, email, senha, tipo_usuario, criador_id })
    if (resUsuario.changes === 0) throw new Error("Não foi possível criar o usuário")

    const eh_colaborador = 1 // criado como colaborador para aparecer na listagem de vendedor e outras
    const resPessoa = dbInsert('pessoa', { nome, email, eh_colaborador, empresa_id, criador_id })
    if (resPessoa.changes === 0) throw new Error("Não foi possível criar a pessoa")

    const pessoa_id = resPessoa.lastInsertRowid
    const usuario_id = resUsuario.lastInsertRowid
    const resUsuarioEmpresa = dbInsert('usuario_empresa', { usuario_id, empresa_id, pessoa_id, gpe_id })
    if (resUsuarioEmpresa.changes === 0) throw new Error("Não foi possível criar a relação usuário-empresa")

    commit.run();
    return { ok: true, id: resUsuarioEmpresa.lastInsertRowid }
  } catch (e) {
    rollback.run();
    if (Object.getPrototypeOf(e)?.name === 'SqliteError') {
      if (e.code == 'SQLITE_CONSTRAINT_UNIQUE') {
        return { ok: false, errors: { email: "Este e-mail já está em uso" } }
      } else {
        console.log({ ErroSqlite: { code: e.code, message: e.message } })
      }
    } else {
      console.log({ ErroDesconhecido: Object.getPrototypeOf(e)?.name ?? e })
    }
    console.error(e)
  } finally {
    if (db.inTransaction) {
      rollback.run();
      return { ok: false }
    }
  }
}

export const alterarUsuarioEmpresa = dbTransaction((usuario) => {
  const { id, nome, email, senha, gpe_id, eid } = usuario
  if (nome || email || senha) {
    const [dados, colunas] = sqlValorUpdate({ nome, email, senha: encriptar(senha) })
    const query = db.prepare(`UPDATE usuario SET ${colunas} WHERE id = $id `)
    const resUsuario = query.run({ ...dados, id })
    if (resUsuario.changes === 0) throw new Error("Não foi possível atualizar o usuario")
  }
  const query = db.prepare("UPDATE usuario_empresa SET gpe_id = $gpe_id WHERE usuario_id = $id AND empresa_id = $eid")
  const resUE = query.run({ id, gpe_id, eid })
  if (resUE.changes === 0) throw new Error("Não foi possível atualizar o usuario")
  return { ok: true }
})



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

export function toggleStatusUsuarioEmpresa({ eid, uid }) {
  try {
    const query = db.prepare("SELECT delecao FROM usuario_empresa WHERE usuario_id = $uid AND empresa_id = $eid")
    const usuario = query.get({ eid, uid })
    if (usuario) {
      const agora = Date.now()
      let query, res, message
      if (usuario.delecao) {
        query = db.prepare("UPDATE usuario_empresa SET delecao = NULL WHERE usuario_id = $uid AND empresa_id = $eid")
        res = query.run({ uid, eid })
        message = 'Usuário ativado com sucesso'
      } else {
        query = db.prepare("UPDATE usuario_empresa SET delecao = $agora WHERE usuario_id = $uid AND empresa_id = $eid")
        res = query.run({ uid, eid, agora })
        message = 'Usuário desativado com sucesso'
      }
      if (res.changes == 0) { return { ok: false, message: "O status não foi alterado" } }
      return { ok: true, message }
    } else {
      return { ok: false, message: "Permissão negada" }
    }
  } catch (e) {
    if (Object.getPrototypeOf(e)?.name === 'SqliteError') {
      console.log({ ErroSqlite: { code: e.code, message: e.message } })
    } else {
      console.log({ ErroDesconhecido: Object.getPrototypeOf(e)?.name ?? e })
    }
    console.error(e)
    return { ok: false, message: 'Erro no servidor. Tente mais tarde.' }
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