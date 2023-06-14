import Database from 'better-sqlite3'
import bcrypt from 'bcrypt'

const DB_SQLITE_PATH = process.env.DB_SQLITE_PATH ?? "./data/sqlite.db"
console.log(DB_SQLITE_PATH)
const db = new Database(DB_SQLITE_PATH, { verbose: console.log })

export function criarSessaoDB(id, expiracao, usuarioId) {
  const query = db.prepare('insert into sessao (id, expiracao, usuario_id) values ($id, $expiracao, $usuarioId)')
  query.run({ id, expiracao, usuarioId })
}
export function buscarSessaoDB(id) {
  const query = db.prepare('select id, expiracao from sessao where id = $id')
  const row = query.get({ id })
  return row ? row : undefined
}
export function apagarSessaoDB(id) {
  const query = db.prepare('delete from sessao where id = $id')
  query.run({ id })
}
export function apagarSessoesExpiradasDB(now) {
  const query = db.prepare('delete from sessao where expiracao < $now')
  query.run({ now })
}
export async function criarUsuario(email, senha, dados) {
  senha = await bcrypt.hash(senha, 10)
  const { nome } = dados
  const query = db.prepare('insert into usuario (email, senha, nome) values ($email, $senha, $nome)')
  query.run({ email, senha, nome })
}
export async function verificarCredencialUsuario(email, senha) {
  const query = db.prepare('select id, senha from usuario where email = $email')
  const rs = query.get({ email })
  return rs && (await bcrypt.compare(senha, rs.senha)) ? rs : false
}
