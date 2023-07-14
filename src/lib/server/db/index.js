import Database from 'better-sqlite3'
import bcrypt from 'bcrypt'
import path from 'node:path'
import url from 'url';
import { sqlTabela, sqlValor, sqlValorUpdate } from './escape';
const env = await import("$env/dynamic/private").then(r => r.env).catch(e => process.env); //eslint-disable-line

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_SQLITE_PATH = env.DB_SQLITE_PATH ?? path.join(__dirname, '../../../../data/sqlite.db')
export const db = new Database(DB_SQLITE_PATH, { verbose: console.log })
const begin = db.prepare('BEGIN');
const commit = db.prepare('COMMIT');
const rollback = db.prepare('ROLLBACK');

export function encriptar(text, rounds = 10) {
  return text ? bcrypt.hashSync(text, rounds) : undefined
}

// Higher order function - returns a function that always runs in a transaction
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
//!###################################################################
//* Sessão
export function criarSessaoDB(id, expiracao, usuarioId) {
  try {
    // console.log({id, expiracao, usuarioId})
    const query = db.prepare('INSERT INTO sessao (id, expiracao, usuario_id) VALUES ($id, $expiracao, $usuarioId);')
    const [values] = sqlValor({ id, expiracao, usuarioId })
    const { changes, lastInsertRowid } = query.run(values)
    return changes ? lastInsertRowid : undefined
  } catch (e) {
    //TODO criar mensagens para erros conhecidos. Ex: valor inválido, usuario não existe. Erro desconhecido: printar todo erro e retornar undefined
    console.error(e)
    return undefined
  }
}

export function buscarSessaoDB(id) {
  try {
    const query = db.prepare("\
SELECT s.id sid, s.expiracao expiracao, u.id uid, u.nome nome, u.email, u.tipo_usuario perm, ue.empresa_id, ue.pessoa_id, ue.gpe_id \
FROM sessao s LEFT JOIN usuario u ON u.id = s.usuario_id LEFT JOIN usuario_empresa ue ON ue.usuario_id = s.usuario_id WHERE s.id = $id")
    const row = query.get({ id })
    return row ? row : undefined
  } catch (e) {
    //TODO criar mensagens para erros conhecidos. Ex: valor inválido. Erro desconhecido: printar todo erro e retornar undefined
    console.error(e)
    return undefined
  }
}

export function apagarSessaoDB(id) {
  try {
    const query = db.prepare('DELETE FROM sessao WHERE id = $id')
    const { changes, lastInsertRowid } = query.run({ id })
    return changes
  } catch (e) {
    //TODO criar mensagens para erros conhecidos. Ex: valor inválido. Erro desconhecido: printar todo erro e retornar undefined
    console.error(e)
    return undefined
  }
}
export function apagarSessoesExpiradasDB(now) {
  try {
    const query = db.prepare('DELETE FROM sessao WHERE expiracao < $now')
    const { changes, lastInsertRowid } = query.run({ now })
    return changes
  } catch (e) {
    //TODO criar mensagens para erros conhecidos. Ex: valor inválido. Erro desconhecido: printar todo erro e retornar undefined
    console.error(e)
    return undefined
  }
}

export function limparSessoesUsuarioDB(uid) {
  try {
    const query = db.prepare('SELECT id FROM sessao WHERE usuario_id = $id')
    const sessoes = query.pluck().all({ id: uid })

    const mutateDelete = db.prepare('DELETE FROM sessao WHERE usuario_id = $id')
    const resDelete = mutateDelete.run({ id: uid })

    if (resDelete.changes < sessoes.length) console.log(`UID ${uid}: ${resDelete.changes} de ${sessoes.length} sessões apagadas.`)
    return sessoes

  } catch (e) {
    //TODO criar mensagens para erros conhecidos. Ex: valor inválido. Erro desconhecido: printar todo erro e retornar undefined
    console.error(e)
    return undefined
  }
}
//!###################################################################
//* Usuário //!!
export function verificarCredenciaisUsuario(email, senha) {
  try {
    const query = db.prepare('SELECT * FROM usuario WHERE email = $email AND delecao IS NULL;')
    const u = query.get({ email })
    return u && bcrypt.compareSync(senha, u.senha) ? u : undefined
  } catch (e) {
    //TODO criar mensagens para erros conhecidos. Ex: valor inválido. Erro desconhecido: printar todo erro e retornar undefined
    console.error(e)
    return undefined

  }
}

export function listarUsuarios() {
  try {
    const query = db.prepare('SELECT u.*, c.nome as criador FROM usuario u left join usuario c on c.id = u.criador_id')
    return query.all()
  } catch (e) {
    //TODO criar mensagens para erros conhecidos. Ex: valor inválido. Erro desconhecido: printar todo erro e retornar undefined
    console.error(e)
    return undefined
  }
}

export function dbInsert(tabela, dados) {
  tabela = sqlTabela(tabela)
  const [valores, colunas, templateValores] = sqlValor(dados)
  const mutation = db.prepare(`INSERT INTO ${tabela} (${colunas}) VALUES (${templateValores})`)
  return mutation.run(valores)
}

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

const criarUsuarioEPessoa = dbTransaction((usuario) => {
  let [dados, colunas, valores] = sqlValor({ ...usuario, senha: bcrypt.hashSync(usuario.senha, 10), senha_repetir: undefined })
  let sql = `INSERT INTO usuario (${colunas}) VALUES (${valores})`
  const query = db.prepare(sql)
  const { lastInsertRowid: usuario_id, changes } = query.run(dados)
  if (changes == 0) throw new Error("Usuário não foi criado")
  // let { criador_id, nome, email } = dados
  // let [dados2, colunas2, valores2] = sqlValor({ criador_id, usuario_id, nome, email })
  // let sql2 = `INSERT INTO pessoa (${colunas2}) VALUES (${valores2})`
  // const query2 = db.prepare(sql2)
  // const { lastInsertRowid: pessoa_id, changes: changes2 } = query2.run(dados2)
  // if (changes2 == 0) throw new Error("Pessoa não foi criada")
  return { usuario_id }
})


export function criarUsuario(usuario) {
  try {
    const { usuario_id, pessoa_id } = criarUsuarioEPessoa(usuario)
    return { ok: true, id: usuario_id, message: 'Usuário criado com sucesso.' }
  } catch (e) {
    if (Object.getPrototypeOf(e)?.name === 'SqliteError') {
      if (e.code == 'SQLITE_CONSTRAINT_UNIQUE') {
        return { ok: false, message: 'Houve problemas em alguns campos.', fieldMessage: { email: ['Este e-mail já está em uso.'] } }
      } else {
        console.log({ ErroSqlite: { code: e.code, message: e.message } })
      }
    } else {
      console.log({ ErroDesconhecido: Object.getPrototypeOf(e)?.name ?? e })
    }
    console.log(e)
    return { ok: false, message: e?.message ?? 'Erro no servidor. Tente mais tarde.' }
  }
}

export function alterarUsuario(usuario) {
  try {
    const { usuario_id, pessoa_id } = alterarUsuarioEPessoa(usuario)
    return { ok: true, id: usuario_id, message: 'Usuário criado com sucesso.' }
  } catch (e) {
    if (Object.getPrototypeOf(e)?.name === 'SqliteError') {
      if (e.code == 'SQLITE_CONSTRAINT_UNIQUE') {
        return { ok: false, message: 'Houve problemas em alguns campos.', fieldMessage: { email: ['Este e-mail já está em uso.'] } }
      } else {
        console.log({ ErroSqlite: { code: e.code, message: e.message } })
      }
    } else {
      console.log({ ErroDesconhecido: Object.getPrototypeOf(e)?.name ?? e })
    }
    console.log(e)
    return { ok: false, message: e?.message ?? 'Erro no servidor. Tente mais tarde.' }
  }
}

export function alterarStatusUsuarioDB({ uid, id }) {
  if (id === 0) {
    console.log("Tentaram apagar o Master. :O")
    return { ok: false, message: "Permissão negada" }
  }
  if (uid !== 0) {
    console.log("Tentaram apagar usuarios sem ser na conta do master")
    return { ok: false, message: "Permissão negada" }
  }
  try {
    const query = db.prepare("SELECT criador_id, id, delecao FROM usuario WHERE id = $id")
    const usuario = query.get({ id })
    if (uid != null && usuario.criador_id === uid) {
      const agora = Date.now()
      let query, res, message
      if (usuario.delecao) {
        query = db.prepare("UPDATE usuario SET delecao = NULL WHERE id = $id")
        res = query.run({ id })
        message = 'Usuário ativado com sucesso'
      } else {
        query = db.prepare("UPDATE usuario SET delecao = $agora WHERE id = $id")
        res = query.run({ id, agora })
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
    return { ok: false, message: 'Erro no servidor. Tente mais tarde.' }
  }
}

export function alterarSenhaUsuario(usuario) {
  const { id, senha } = usuario
  try {
    const query = db.prepare("UPDATE usuario SET senha = $senha WHERE id = $id")
    const { changes } = query.run({ id, senha })
    if (changes > 0) return { ok: true, message: 'Senha alterada com sucesso.' }
    return { ok: false, message: "A senha não foi alterada." }
  } catch (e) {
    if (Object.getPrototypeOf(e)?.name === 'SqliteError') {
      console.log({ ErroSqlite: { code: e.code, message: e.message } })
    } else {
      console.log({ ErroDesconhecido: Object.getPrototypeOf(e)?.name ?? e })
    }
    console.error(e)
    return { ok: false, message: e?.message ?? 'Erro no servidor. Tente mais tarde.' }
  }
}

export function criarGPEInicial(empresa_id) {
  try {
    const query = db.prepare("INSERT OR IGNORE INTO grupo_permissao_empresa (empresa_id,nome,pode_iniciar_venda,pode_ver_estoque_disponivel,pode_ver_historico_vendas,pode_ver_estoque,pode_entrada_estoque,pode_saida_estoque,pode_ver_saldo,pode_transacao_receita,pode_transacao_despesa,pode_cadastrar_produto,pode_cadastrar_pessoa,pode_cadastrar_conta,pode_cadastrar_usuario)\
VALUES ( $empresa_id ,'Básico',1,1,1,1,0,0,0,0,0,0,0,0,0),( $empresa_id ,'Gerência',1,1,1,1,1,1,0,0,1,1,1,0,0),( $empresa_id ,'Direção',1,1,1,1,1,1,1,1,1,1,1,1,1)")
    const res = query.run({ empresa_id })
    const select = db.prepare("SELECT id FROM grupo_permissao_empresa g WHERE g.nome = 'Direção' AND g.empresa_id = $empresa_id")
    const direcao_id = select.pluck().get({ empresa_id })
    return direcao_id
  } catch (e) {
    if (Object.getPrototypeOf(e)?.name === 'SqliteError') {
      console.log({ ErroSqlite: { code: e.code, message: e.message } })
    } else {
      console.log({ ErroDesconhecido: Object.getPrototypeOf(e)?.name ?? e })
    }
    console.error(e)
    return undefined
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
 * @property {T[]} data - Dados válidos do resultado da execução SQL
 */
/**
 * @template T - Tipo dos dados do resultado.
 * @typedef {Object} ResultValid<T>
 * @property {true} valid - Validade do resultado da execução SQL
 * @property {T} data - Dados válidos do resultado da execução SQL
 */
/**
 * @template T - Tipo dos dados do resultado.
 * @typedef {ResultSetValid<T> | ResultSetInvalid<T>} DBAll<T>
 */