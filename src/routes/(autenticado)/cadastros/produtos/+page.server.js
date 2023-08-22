import { alternarStatusProduto, consultarProdutos, criarProduto, editarProduto } from '$lib/server/db/models/produto.js';
import { consultarProdutoCategorias } from '$lib/server/db/models/produtoCategoria.js';
import { consultarRegrasComissao } from '$lib/server/db/models/regra_comissao.js';
import { consultarRegrasTributo } from '$lib/server/db/models/regra_tributo.js';
import { idSchema } from '$lib/zod/index.js';
import { criarProdutoSchema, editarProdutoSchema } from '$lib/zod/schemas/produto.js';
import { message, setError, superValidate } from 'sveltekit-superforms/server';

export async function load({ locals }) {
  const formAdicionar = await superValidate(criarProdutoSchema)
  const formEditar = await superValidate(editarProdutoSchema)
  const empresa_id = locals.sessao.empresa_id
  let produtos, categorias
  const rsProdutos = consultarProdutos({ empresa_id })
  if (rsProdutos.valid) {
    produtos = rsProdutos.data
  }
  const regrasComissao = consultarRegrasComissao({ empresa_id }).data ?? []
  const regrasTributo = consultarRegrasTributo({ empresa_id }).data ?? []

  const rsCategorias = consultarProdutoCategorias({ empresa_id })
  if (rsCategorias.valid) {
    categorias = rsCategorias.data
  }
  return { produtos, categorias, regrasComissao, regrasTributo, formAdicionar, formEditar };
};

export const actions = {
  adicionar: async ({ request, locals }) => {
    const form = await superValidate(request, criarProdutoSchema);
    if (form.valid) {
      const empresa_id = locals.sessao.empresa_id
      const criador_id = locals.sessao.uid
      const res = criarProduto({ empresa_id, criador_id, ...form.data })
      if (res.valid) { return message(form, "Produto criado com sucesso") }
      if (res.fieldErrors) {
        for (let [field, text] of Object.entries(res.fieldErrors)) setError(form, field, text)
        return message(form, 'Houve problemas em alguns campos', { status: 400 })
      }
      return message(form, 'Erro no servidor. Não foi possível criar o produto', { status: 500 })
    }
    return message(form, 'Erro no preenchimento dos campos')
  },
  editar: async ({ request }) => {
    const form = await superValidate(request, editarProdutoSchema);
    if (form.valid) {
      const res = editarProduto(form.data)
      if (res.valid) { return message(form, "Produto atualizada com sucesso") }
      if (res.fieldErrors) {
        for (let [field, text] of Object.entries(res.fieldErrors)) setError(form, field, text)
        return message(form, res.message, { status: 400 })
      }
      return message(form, res.message, { status: 500 })
    }
    return message(form, 'Erro no preenchimento dos campos')
  },

  alternarStatus: async ({ request }) => {
    const form = await superValidate(request, idSchema);
    if (form.valid) {
      const res = alternarStatusProduto(form.data)
      if (res.valid) { return message(form, res.data) }
      if (res.fieldErrors) {
        for (let [field, text] of Object.entries(res.fieldErrors)) setError(form, field, text)
        return message(form, res.message, { status: 400 })
      }
      return message(form, res.message, { status: 500 })
    }
    return message(form, 'Erro no preenchimento dos campos')
  },
}