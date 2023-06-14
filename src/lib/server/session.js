import { randomBytes } from 'node:crypto'
import { apagarSessaoDB, apagarSessoesExpiradasDB, buscarSessaoDB, criarSessaoDB } from './db'

const sessionStore = new Map()
let nextClean = Date.now() + 1000 * 60 * 60 // 1 hour

function limparSessoes() {
  const now = Date.now()
  for (const [sid, session] of sessionStore) {
    if (session.invalidAt < now) {
      sessionStore.delete(sid)
    }
  }
  apagarSessoesExpiradasDB(now)
  nextClean = Date.now() + 1000 * 60 * 60 // 1 hour
}

export function criarSessao(email, maxAge) {
  let id = ''
  do {
    id = randomBytes(32).toString('hex')
  } while (sessionStore.has(id))
  const expires = Date.now() + maxAge * 1000
  criarSessaoDB(id, expires)
  sessionStore.set(id, { ...data, invalidAt: expires })
  if (Date.now() > nextClean) {
    setTimeout(limparSessoes, 5000)
  }
  return id
}

export function buscarSessao(id) {
  if (sessionStore.has(id)) {
    return sessionStore.get(id)
  } else {
    const session = buscarSessaoDB(id)
    if (session) {
      sessionStore.set(id, session)
      return session
    }
  }
  console.log('Sessão não encontrada', id)
  return undefined
}

export function apagarSessao(id) {
  sessionStore.delete(id)
  apagarSessaoDB(id)
}
