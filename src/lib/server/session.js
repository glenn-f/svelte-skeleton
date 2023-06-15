import { randomBytes } from 'node:crypto'
import { apagarSessaoDB, apagarSessoesExpiradasDB, buscarSessaoDB, criarSessaoDB } from './db'

const sessaoStore = new Map()
let nextClean = Date.now() + 1000 * 60 * 60 // 1 hora

function limparSessoes() {
  const now = Date.now()
  for (const [sid, sessao] of sessaoStore) { if (sessao.expiracao < now) { sessaoStore.delete(sid) } }
  apagarSessoesExpiradasDB(now)
  nextClean = Date.now() + (1000 * 60 * 60) // 1 hora
}

export function criarSessao(email, maxAge, usuario) {
  let sid = ''
  do { sid = randomBytes(32).toString('hex') } while (sessaoStore.has(sid))
  const expiracao = Date.now() + maxAge * 1000
  criarSessaoDB(sid, expiracao, usuario.id)
  sessaoStore.set(sid, { sid, uid: usuario.id, email, nome: usuario.nome, expiracao })
  if (Date.now() > nextClean) { setTimeout(limparSessoes, 5000) }
  return sid
}

export function buscarSessao(sid) {
  const sessaoCacheada = sessaoStore.has(sid)
  const sessao = sessaoCacheada ? sessaoStore.get(sid) : buscarSessaoDB(sid)
  if (sessao && (sessao.expiracao > Date.now())) {
    if (!sessaoCacheada) { sessaoStore.set(sid, sessao) }
    return sessao
  }
  if (sessao) apagarSessao(sessao.sid)
  return undefined
}

export function apagarSessao(sid) {
  if (sid) {
    sessaoStore.delete(sid)
    apagarSessaoDB(sid)
  }
}
