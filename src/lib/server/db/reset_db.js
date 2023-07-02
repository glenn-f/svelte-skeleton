//vite-node src\lib\server\db\vite-sql.js
import fs from 'node:fs';
import path from 'node:path';
import url from 'url';
import { db } from '.';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resetSqlPath = path.join(__dirname, 'reset_schema.sql')
const resetSql = fs.readFileSync(resetSqlPath, { encoding: 'utf8' })

const sqlPath = path.join(__dirname, 'schema.sql')
const sql = fs.readFileSync(sqlPath, { encoding: 'utf8' })
db.exec(resetSql)
db.exec(sql)
