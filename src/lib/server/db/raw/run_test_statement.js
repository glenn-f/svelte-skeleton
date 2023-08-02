import { db, dbInsert } from '..'

const transacoes = [{ forma_transacao_id: 11 }, { forma_transacao_id: 12 }]
const forma_transacao_ids = transacoes.map((v) => v.forma_transacao_id).join(',')
let resContas
try {

  resContas = dbInsert('fcg', { id: null })
} catch (error) {
  console.log('Code:', error.code)
  console.log(error.stack)
}

console.log(resContas)
