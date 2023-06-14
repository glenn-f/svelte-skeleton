import { buscarSessao } from '$lib/server/session'

export async function handle({ event, resolve }) {
  const { cookies, locals } = event
  const sid = cookies.get('sid')
  if (sid) {
    const session = buscarSessao(sid)
    if (session) {
      console.log(session)
      locals.email = session.email
    } else {
      cookies.delete('sid')
    }
  }

  return resolve(event)
}
