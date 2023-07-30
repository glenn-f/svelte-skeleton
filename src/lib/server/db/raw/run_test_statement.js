import { db } from '..'

const conta_forma_id = 2
const parcela = 10
const id = db.prepare("SELECT id FROM forma_transacao WHERE conta_forma_id = $conta_forma_id AND parcela = $parcela").pluck().get({ conta_forma_id, parcela })

console.log(id)