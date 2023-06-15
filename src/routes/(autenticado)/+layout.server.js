import { redirect } from '@sveltejs/kit'

export async function load({ locals }) {
  if (!locals.sessao) { throw redirect(302, "/login") }
  return { sessao: locals.sessao }
}