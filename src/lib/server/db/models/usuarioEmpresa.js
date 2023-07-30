import { PESSOA_FISICA, REP_COLABORADOR, USUARIO_ADICIONAL } from "$lib/globals";
import { encriptarSenha } from "$lib/server/encript";
import { begin, commit, db, dbInsert, dbSelectOne, dbToggleSoftDelete, dbUpdate, rollback } from "..";

/**
 * Consulta todos os usuários associados à uma empresa da aplicação
 * @param {{empresa_id: number}} dados Dados da consulta sobre os usuários
 * @returns {DBAll<UsuarioEmpresa>} Lista de usuários pertencentes à empresa 
 */
export function consultarUsuariosEmpresa(dados) {
  const { empresa_id } = dados
  try {
    const query = db.prepare("SELECT ue.gpe_id, ue.criacao, ue.delecao, u.id, u.nome, u.email, u.tipo_usuario, u.criador_id, c.nome criador_nome \
FROM usuario u JOIN usuario_empresa ue ON ue.usuario_id = u.id LEFT JOIN usuario c ON c.id = u.criador_id WHERE ue.empresa_id = $empresa_id")
    const data = query.all({ empresa_id })
    return { valid: true, data }
  } catch (e) {
    console.error(e)
    return { valid: false, message: "Erro desconhecido", code: 'DB_UNKNOWN' }
  }
}

/**
 * @param {{nome:string email:string senha:string criador_id:number empresa_id:number gpe_id:number}} dados
 * @returns {number} usuario_empresa.id
 */
export function criarUsuarioEmpresa(dados) {
  const { nome, email, criador_id, empresa_id, gpe_id } = dados
  const senha = encriptarSenha(dados.senha)
  begin.run();
  try {
    const tipo_usuario = USUARIO_ADICIONAL // usuário criado para uma empresa tem nível de permissão 0
    const resUsuario = dbInsert('usuario', { nome, email, senha, tipo_usuario, criador_id })
    if (resUsuario.changes === 0) throw new Error("Não foi possível criar o usuário")

    const tipo_pessoa = PESSOA_FISICA // PF
    const rep = REP_COLABORADOR // relacionamento colaborador->empresa
    const resPessoa = dbInsert('pessoa', { nome, email, rep, tipo_pessoa, empresa_id, criador_id })
    if (resPessoa.changes === 0) throw new Error("Não foi possível criar a pessoa")

    const pessoa_id = resPessoa.lastInsertRowid
    const usuario_id = resUsuario.lastInsertRowid
    const resUsuarioEmpresa = dbInsert('usuario_empresa', { usuario_id, empresa_id, pessoa_id, gpe_id, criador_id })
    if (resUsuarioEmpresa.changes === 0) throw new Error("Não foi possível criar a relação usuário-empresa")

    commit.run();
    return { valid: true, data: resUsuarioEmpresa.lastInsertRowid }
  } catch (e) {
    rollback.run();
    if (Object.getPrototypeOf(e)?.name === 'SqliteError') {
      if (e.code == 'SQLITE_CONSTRAINT_UNIQUE') {
        return { valid: false, message: "Houve problemas em alguns campos", fieldErrors: { email: "Este e-mail já está em uso" }, code: "DB_UNIQUE" }
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
      return { valid: false, message: 'Erro no servidor', code: "DB_UNKNOWN" }
    }
  }
}

/** //TODO */
export function editarUsuarioEmpresa(dados) {
  const { usuario_id, empresa_id, nome, email, gpe_id } = dados
  begin.run();
  try {
    const usuario = dbUpdate('usuario', { nome, email }, { id: usuario_id, tipo_usuario: USUARIO_ADICIONAL })
    if (usuario.changes === 0) throw new Error("Não foi possível atualizar o usuário")

    const usuario_empresa = dbSelectOne('usuario_empresa', ['pessoa_id'], { usuario_id, empresa_id })
    if (!usuario_empresa) throw new Error("Usuário empresa não encontrado")

    const pessoa = dbUpdate('pessoa', { nome, email }, { id: usuario_empresa.pessoa_id })
    if (pessoa.changes === 0) throw new Error("Não foi possível atualizar a pessoa")

    const resUsuarioEmpresa = dbUpdate('usuario_empresa', { gpe_id }, { usuario_id, empresa_id })
    if (resUsuarioEmpresa.changes === 0) throw new Error("Não foi possível atualizar a relação usuário-empresa")

    commit.run();
    return { valid: true, data: null }
  } catch (e) {
    rollback.run();
    if (Object.getPrototypeOf(e)?.name === 'SqliteError') {
      if (e.code == 'SQLITE_CONSTRAINT_UNIQUE') {
        return { valid: false, message: "Houve problemas em alguns campos", fieldErrors: { email: "Este e-mail já está em uso" }, code: "DB_UNIQUE" }
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
      return { valid: false, message: 'Erro no servidor', code: "DB_UNKNOWN" }
    }
  }
}

/** //TODO */
export function toggleStatusUsuarioEmpresa(dados) {
  const q = db.prepare("SELECT ue.delecao, u.tipo_usuario FROM usuario u JOIN usuario_empresa ue ON ue.usuario_id = u.id WHERE ue.empresa_id = $empresa_id AND u.id = $usuario_id")
  const checkUser = q.get(dados)
  // if (!checkUser || (checkUser.tipo_usuario !== USUARIO_ADICIONAL)) {
  //   return { valid: false, message: "Permissão negada!", code: "NO_PRIVILEGES" }
  // }
  const estavaDesativado = checkUser.delecao
  try {
    const res = dbToggleSoftDelete('usuario_empresa', dados)
    if (res.changes == 0) { return { valid: false, message: "O status não foi alterado", code: "DB_UNKNOWN" } }
    if (!estavaDesativado) {
      return { valid: true, data: "Usuário desativado com sucesso" }
    } else {
      return { valid: true, data: "Usuário ativado com sucesso" }
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

/** //TODO */
export function alterarSenhaUsuarioEmpresa(dados) {
  const id = dados.id
  const senha = encriptarSenha(dados.senha)
  try {
    const { changes } = dbUpdate('usuario', { senha }, { id, tipo_usuario: USUARIO_ADICIONAL })
    if (changes > 0) {
      return { valid: true, data: null }
    } else {
      return { valid: false, message: "A senha não foi alterada", code: "DB_UNKNOWN" }
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

//!JSDocs
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