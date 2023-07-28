import { compararSenhas, encriptarSenha } from "$lib/server/encript"
import { db, dbInsert, dbSelectOne, dbToggleSoftDelete, dbUpdate } from ".."

//! CRUD Usuários - Admin
/**
 * Consulta todos os usuários da aplicação (ADMIN)
 * @returns {DBAll<Usuario>} Lista de usuários registrados
 */
export function consultarUsuarios() {
  try {
    const query = db.prepare('SELECT u.id,u.nome,u.email,u.tipo_usuario,u.criador_id,c.nome as criador,u.criacao,u.alteracao,u.delecao FROM usuario u LEFT JOIN usuario c ON c.id = u.criador_id')
    const data = query.all()
    return { valid: true, data }
  } catch (e) {
    console.error(e)
    return { valid: false, message: "Erro desconhecido", code: 'DB_UNKNOWN' }
  }
}

export function detalharUsuario(dados) {
  try {
    const rs = db.prepare("SELECT * FROM usuario WHERE id = $id").get(dados)
    return rs || undefined
  } catch (e) {
    console.error(e)
    return undefined
  }
}

/**
 * Cria um usuário no banco de dados, retornando o ID criado ou os erros emitidos (ADMIN)
 * @param {UsuarioCreate} dados Dados do usuário para criação de registro
 * @returns {DBRun<UsuarioCreate>} Resultado da criação do usuário
 */
export function criarUsuario(dados) {
  const { nome, email, tipo_usuario } = dados
  const senha = encriptarSenha(dados.senha)
  try {
    const { changes, lastInsertRowid } = dbInsert('usuario', { nome, email, senha, tipo_usuario })
    if (changes > 0) {
      return { valid: true, data: lastInsertRowid }
    } else {
      return { valid: false, message: "Usuário não foi criado", code: "DB_UNKNOWN" }
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

/**
 * Atualiza os dados de um usuário no banco de dados, retornando válido ou os erros emitidos (ADMIN)
 * @param {UsuarioUpdate} dados Dados do usuário para atualização
 * @returns {DBRun<UsuarioUpdate>} Resultado da atualização do usuário
 */
export function editarUsuario(dados) {
  const { id, nome, email, tipo_usuario } = dados
  const senha = dados.senha ? encriptarSenha(dados.senha) : undefined
  try {
    const { changes } = dbUpdate('usuario', { nome, email, tipo_usuario, senha }, { id })
    if (changes > 0) {
      return { valid: true, data: null }
    } else {
      return { valid: false, message: "Nenhum usuário foi atualizado", code: "DB_UNKNOWN" }
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

/**
 * Alterna o status de usuário (ativar ou desativar) a partir do seu ID.
 * @param {{id: number}} dados ID do usuário a ser alternado
 * @returns {DBSoftDelete<{id: number}>} Resultado da alteração de status
 */
export function alternarStatusUsuario(dados) {
  const { id } = dados
  try {
    const res = dbToggleSoftDelete('usuario', { id })
    if (res.changes == 0) { return { valid: false, message: "O status não foi alterado", code: "DB_UNKNOWN" } }
    const usuario = dbSelectOne('usuario', ['delecao'], { id })
    if (usuario?.delecao) {
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

//! Login e Perfil (Público)
/**
 * Verifica credenciais e retorna o usuário
 * @param {{email: string senha: string}} dados Email e senha do usuário
 * @returns {DBGet<Usuario>} Dados gerais do usuário
 */
export function verificarCredenciaisUsuario(dados) {
  const { email, senha } = dados
  try {
    const query = db.prepare('SELECT * FROM usuario WHERE email = $email AND delecao IS NULL')
    const rs = query.get({ email })
    if (rs && compararSenhas(senha, rs.senha)) {
      return { valid: true, data: rs }
    } else {
      return { valid: false, message: "Credenciais Inválidas", code: 'INVALID_CREDENTIALS' }
    }
  } catch (e) {
    console.error(e)
    return { valid: false, message: "Erro desconhecido", code: 'DB_UNKNOWN' }
  }
}

/**
 * Atualiza a senha de um usuário, retornando válido ou os erros emitidos (PERFIL)
 * @param {UsuarioUpdateSenha} dados Dados do usuário para atualização
 * @returns {DBRun<UsuarioUpdateSenha>} Resultado da atualização do usuário
 */
export function alterarSenhaUsuario(dados) {
  const { id } = dados
  const senha = encriptarSenha(dados.senha)
  try {
    const { changes } = dbUpdate('usuario', { senha }, { id })
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

//! JSDocs
/**
 * @typedef {Object} Usuario
 * @property {number} id O ID do usuário
 * @property {string} nome O nome do usuário
 * @property {string} email O endereço de e-mail do usuário
 * @property {number} tipo_usuario O tipo de usuário na aplicação
 * @property {number} [criador_id] O ID do criador do usuário
 * @property {string} [criador_nome] O nome do criador do usuário
 * @property {number} criacao Data de criacao do usuário
 * @property {number} [alteracao] Data da última alteração do usuário
 * @property {number} [delecao] Data de desativação do usuário
 */

/**
 * @typedef {Object} UsuarioCreate
 * @property {string} nome O nome do usuário
 * @property {string} email O endereço de e-mail do usuário
 * @property {string} senha A senha do usuário
 * @property {number} tipo_usuario O tipo de usuário na aplicação
 */

/**
 * @typedef {Object} UsuarioUpdate
 * @property {number} id ID do usuário
 * @property {string} nome O nome do usuário
 * @property {string} email O endereço de e-mail do usuário
 * @property {string} senha A senha do usuário
 * @property {number} tipo_usuario O tipo de usuário na aplicação
 */

/**
 * @typedef {Object} UsuarioUpdateSenha
 * @property {number} id ID do usuário
 * @property {string} senha A senha do usuário
 */

/**
  * @template T
  * @typedef {import('..').DBAll<T>} DBAll<T>
*/

/**
  * @template T
  * @typedef {import('..').DBGet<T>} DBGet<T>
*/

/**
  * @template T
  * @typedef {import('..').DBRun<T>} DBRun<T>
*/

/**
  * @template T
  * @typedef {import('..').DBSoftDelete<T>} DBSoftDelete<T>
*/