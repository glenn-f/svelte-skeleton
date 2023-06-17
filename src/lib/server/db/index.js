import Database from 'better-sqlite3'
import bcrypt from 'bcrypt'
const env = await import("$env/dynamic/private").then(r => { console.log("$env"); return r.env; }).catch(e => { console.log("process.env"); return process.env; });

console.log(env.DB_SQLITE_PATH)
const DB_SQLITE_PATH = env.DB_SQLITE_PATH ?? './data/sqlite.db'
const db = new Database(DB_SQLITE_PATH, { verbose: console.log })

//* Helpers
function qr(query, params) {
  try {
    return query.run(params)
  } catch (e) {
    console.log("QueryRun Error:", e?.message?.split("\n"))
    return undefined
  }
}

//* Sessão
export function criarSessaoDB(id, expiracao, usuarioId) {
  const query = db.prepare('insert into sessao (id, expiracao, usuario_id) values ($id, $expiracao, $usuarioId)')
  return qr(query, { id, expiracao, usuarioId })?.lastInsertRowid
}
export function buscarSessaoDB(id) {
  const query = db.prepare('select s.id sid, s.expiracao expiracao, u.id uid, u.nome nome, u.email email from sessao s left join usuario u on u.id = s.usuario_id where s.id = $id')
  const row = query.get({ id })
  return row ? row : undefined
}
export function apagarSessaoDB(id) {
  const query = db.prepare('delete from sessao where id = $id')
  return query.run({ id }).changes
}
export function apagarSessoesExpiradasDB(now) {
  const query = db.prepare('delete from sessao where expiracao < $now')
  return query.run({ now }).changes
}
//* Usuário
export function criarUsuario(email, senha, dados) {
  senha = bcrypt.hashSync(senha, 10)
  const { nome } = dados
  const query = db.prepare('insert into usuario (email, senha, nome) values ($email, $senha, $nome)')
  return qr(query, { email, senha, nome })?.lastInsertRowid
}

export function verificarCredenciaisUsuario(email, senha) {
  const query = db.prepare('select * from usuario where email = $email')
  const rs = query.get({ email })
  return rs && bcrypt.compareSync(senha, rs.senha) ? rs : undefined
}
