//vite-node src\lib\server\db\raw\run_set_initial_schema.js
import fs from 'node:fs';
import path from 'node:path';
import url from 'url';
import { db } from '..';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sqlPath = path.join(__dirname, 'app_schema.sql')
const sql = fs.readFileSync(sqlPath, { encoding: 'utf8' })
db.exec(sql)
