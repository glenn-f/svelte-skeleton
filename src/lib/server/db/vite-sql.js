//vite-node src\lib\server\db\vite-sql.js
import fs from 'node:fs'
import path from 'node:path'
import url from 'url'
import { criarUsuario, db } from '.'

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sqlPath = path.join(__dirname, 'schema.sql')
const sql = fs.readFileSync(sqlPath, { encoding: 'utf8' })
db.exec(sql)

try {
  const u = criarUsuario({ email: "glenn@adm.cossms", senha: "senha", nome: "Glenn Fonseca" })
  console.log(u)
} catch (e) {
  console.error(e)
}
