import Database from 'better-sqlite3'
import bcrypt from 'bcrypt'
import path from 'node:path'
import url from 'url';
import { sqlValor } from './escape';
const env = await import("$env/dynamic/private").then(r => r.env).catch(e => process.env); //eslint-disable-line

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_SQLITE_PATH = env.DB_SQLITE_PATH ?? path.join(__dirname, '../../../../data/sqlite.db')
export const db = new Database(DB_SQLITE_PATH, { verbose: console.log })
//!###################################################################
//* Sessão
export function criarSessaoDB(id, expiracao, usuarioId) {
  try {
    const query = db.prepare('insert into sessao (id, expiracao, usuario_id) values ($id, $expiracao, $usuarioId)')
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
    const query = db.prepare('select s.id sid, s.expiracao expiracao, u.id uid, u.nome nome, u.email email from sessao s left join usuario u on u.id = s.usuario_id where s.id = $id')
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
    const query = db.prepare('delete from sessao where id = $id')
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
    const query = db.prepare('delete from sessao where expiracao < $now')
    const { changes, lastInsertRowid } = query.run({ now })
    return changes
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
    const query = db.prepare('select * from usuario where email = $email')
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
    const query = db.prepare('select u.*, c.nome as criador from usuario u left join usuario c on c.id = u.criador_id')
    return query.all()
  } catch (e) {
    //TODO criar mensagens para erros conhecidos. Ex: valor inválido. Erro desconhecido: printar todo erro e retornar undefined
    console.error(e)
    return undefined
  }
}


export function criarUsuario(usuario) {
  let [dados, colunas, valores] = sqlValor({ ...usuario, senha: bcrypt.hashSync(usuario.senha, 10), senha_repetir: undefined })
  let sql = `INSERT INTO usuario (${colunas}) VALUES (${valores})`
  try {
    const query = db.prepare(sql)
    const { lastInsertRowid, changes } = query.run(dados)
    if (changes > 0)
      return { ok: true, id: lastInsertRowid, message: 'Usuário criado com sucesso.' }
    else
      return { ok: false, message: 'O usuário não foi criado. O serviço de dados não retornou erros.' }
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
    return { ok: false, message: 'Erro no servidor. Tente mais tarde.' }
  }
}
