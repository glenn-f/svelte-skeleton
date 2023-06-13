import Database from 'better-sqlite3';
import { DB_PATH } from '$env/static/private';
import bcrypt from 'bcrypt';

const db = new Database(DB_PATH, { verbose: console.log });

function addSessionsTable() {
    const sql = `
	create table if not exists sessions (
		ses_id          text primary key
	, ses_created     integer not null default (strftime( '%s', 'now' ) * 1000)
	, ses_expires     integer not null
	, ses_data        text not null
	) strict;
	`;
    const stmnt = db.prepare(sql);
    stmnt.run();
}