import { buscarSessao } from '$lib/server/session'

export async function handle({ event, resolve }) {
  const { cookies, locals } = event
  const sid = cookies.get('sid')

  if (sid) {
    const sessao = buscarSessao(sid)
    if (sessao) { locals.sessao = sessao }
    else { cookies.delete('sid') }
  }

  return resolve(event)
}
