import { consultarEstoques } from '$lib/server/db/models/estoque.js'
import { consultarProdutos } from '$lib/server/db/models/produto.js'
import { error } from '@sveltejs/kit'

export async function load({ locals }) {
  const empresa_id = locals.sessao.empresa_id
  const res = consultarEstoques({ empresa_id })
  if (!res.valid) throw error(500, "Erro no servidor")
  const estoques = res.data

  return { estoques }
}