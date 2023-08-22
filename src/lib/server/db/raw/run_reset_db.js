//vite-node src\lib\server\db\raw\run_reset_db.js
import fs from 'node:fs';
import path from 'node:path';
import url from 'url';
import { db } from '..';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resetSchemaPath = path.join(__dirname, 'app_reset_schema.sql')
const resetarSchema = fs.readFileSync(resetSchemaPath, { encoding: 'utf8' })

const schemaPath = path.join(__dirname, 'app_schema.sql')
const criarSchema = fs.readFileSync(schemaPath, { encoding: 'utf8' })

const seedPath = path.join(__dirname, 'app_seed.sql')
const seedInserts = fs.readFileSync(seedPath, { encoding: 'utf8' })

db.exec(resetarSchema)
db.exec(criarSchema)
db.exec(seedInserts)
