import { buscarSessao } from '$lib/server/session'
import { Logger } from '$lib/logger'
import { dev } from '$app/environment'
import { sequence } from '@sveltejs/kit/hooks'
import { error, redirect } from '@sveltejs/kit'

async function iniciarLog({ event, resolve }) {
  event.locals.log = new Logger(event, dev)
  if (event.route.id === null) {
    event.locals.log.end("Rota não encontrada", "red")
    throw error(404, "Página não encontrada")
  }
  return resolve(event)
}

async function lerCookies({ event, resolve }) {
  const { cookies, locals } = event
  const sid = cookies.get('sid')
  locals.sessao = sid ? buscarSessao(sid) : null;

  if (!locals.sessao) { cookies.delete('sid') }

  return resolve(event)
}

async function verificarAutenticacao({ event, resolve }) {
  if (event.route.id?.startsWith('/(autenticado)') && !event.locals.sessao) {
    event.locals.log.auth("Rota não autorizada para este usuário")
    throw redirect(307, "/login")
  }

  return resolve(event)
}

async function finalizarLog({ event, resolve }) {
  const res = await resolve(event)
  event.locals.log.end()
  return res
}

export const handle = sequence(iniciarLog, lerCookies, verificarAutenticacao, finalizarLog)
