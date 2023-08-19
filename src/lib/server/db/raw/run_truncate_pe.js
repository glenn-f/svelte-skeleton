//vite-node src\lib\server\db\vite-sql.js
import fs from 'node:fs';
import path from 'node:path';
import url from 'url';
import { db } from '..';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const truncSchemaPath = path.join(__dirname, 'app_truncar_processos.sql')
const truncarQuery = fs.readFileSync(truncSchemaPath, { encoding: 'utf8' })

db.exec(truncarQuery)
