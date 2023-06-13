import Database from 'better-sqlite3';
import { DB_PATH } from '$env/static/private';
import bcrypt from 'bcrypt';

const db = new Database(DB_PATH, { verbose: console.log });

export function criarSessaoDB(id, expiracao) {
	const query = db.prepare("insert into sessao (id, expiracao) values ($id, $expiracao)");
	query.run({ id, expiracao });
}
export function buscarSessaoDB(id) {
	const query = db.prepare("select id, expiracao from sessao where id = $id");
	const row = query.get({ id })
	return row ? row : undefined;
}
export function apagarSessaoDB(id) {
	const query = db.prepare("delete from sessao where id = $id");
	query.run({ id });
}
export function apagarSessoesExpiradasDB(now) {
	const query = db.prepare("delete from sessao where expiracao < $now");
	query.run({ now });
}
export async function criarUsuario(email, senha) {
	senha = await bcrypt.hash(senha, 10);
	const query = db.prepare("insert into usuario (email, senha) values ($email, $senha)");
	query.run({ email, senha });
}
export async function verificarCredencialUsuario(email, senha) {
	const query = db.prepare("select senha from usuario where email = $email");
	const rs = query.get({ email })
	return rs ? bcrypt.compare(senha, rs.password) : false
}