import { buscarSessao } from '$lib/server/session'
import { Logger } from '$lib/logger'
import { dev } from '$app/environment'
import { sequence } from '@sveltejs/kit/hooks'
import { error, redirect } from '@sveltejs/kit'
import { buscarEmpresa, buscarGPE } from './lib/server/cache'

async function iniciarLog({ event, resolve }) {
  const headers = event.request.headers
  event.locals.log = new Logger(event, dev)
  if (event.route.id === null) {
    event.locals.log.end("Rota não encontrada", "red")
    throw error(404, "Página Não Encontrada")
  }
  return resolve(event)
}

async function lerCookies({ event, resolve }) {
  const { cookies, locals } = event
  const sid = cookies.get('sid')
  locals.sessao = sid ? buscarSessao(sid) : null;

  if (!locals.sessao) {
    //* Sessão Expirada: comer cookie
    cookies.delete('sid', { path: '/' })
  }
  else {
    //* Sessão Válida: Carregar dados do Cache
    //? EMPRESA + GRUPO DE PERMISSÃO NA EMPRESA
    locals.sessao.empresa = buscarEmpresa(locals.sessao.empresa_id)
    locals.sessao.gpe = buscarGPE(locals.sessao.gpe_id)
    // locals.sessao.pessoa = buscarPessoa(locals.sessao.pessoa_id)
  }

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

export function handleError({ error }) {
  console.error(error)
  return {
    message: 'Oops! Ocorreu um erro inesperado. Tente refazer a ação e reporte para o administrador.',
    code: error?.code ?? 'ERRO_DESCONHECIDO'
  };
}