import { FE_VENDA } from '$lib/globals'
import { db, dbInsert, dbSelectOne, dbUpdate } from '..'

const pe_id = 6
const checkEstoque = db.prepare("SELECT CAST(SUM(e.custo) AS REAL)/10000 custo, CAST(SUM(fe.var_custo) AS REAL)/10000 var_custo FROM estoque e JOIN fe ON fe.estoque_id = e.id WHERE fe.pe_id = $pe_id").all({ pe_id })
const checkTransacoes = db.prepare("SELECT CAST(SUM(ff.valor) AS REAL)/10000 pagamento FROM pe_transacao p JOIN transacao t ON p.transacao_id = t.id JOIN ff ON ff.id = t.transacao_ff_id WHERE p.pe_id = $pe_id").all({ pe_id })

console.log({ checkEstoque, checkTransacoes })