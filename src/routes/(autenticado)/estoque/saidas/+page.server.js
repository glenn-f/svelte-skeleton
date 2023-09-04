import { consultarSaidas } from '$lib/server/db/models/processoEstoque.js'
import { error } from '@sveltejs/kit'

export async function load({ locals }) {
  const empresa_id = locals.sessao.empresa_id
  const res = consultarSaidas({ empresa_id })
  if (!res.valid) throw error(500, "Erro no servidor")

  const saidas = res.data
  return { saidas }
}