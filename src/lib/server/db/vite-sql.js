//vite-node src\lib\server\db\vite-sql.js
import Database from 'better-sqlite3'
import fs from 'fs'

const dbPath = process.env.DB_PATH || './data/sqlite.db'
const sqlPath = './src/lib/server/db/schema.sql'
const db = new Database(dbPath, { verbose: console.log, foreignKeys: true })
const sql = fs.readFileSync(sqlPath, { encoding: 'utf8' })

db.exec(sql)
