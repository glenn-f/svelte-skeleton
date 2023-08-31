import { redirect } from '@sveltejs/kit'

export async function load({ locals }) {
  if (!locals.sessao) { throw redirect(302, "/login") }
  const sessao = locals.sessao
  const { empresa, gpe, ...usuario } = sessao
  const title = empresa?.nome_fantasia ?? ""
  return { sessao, title }
}