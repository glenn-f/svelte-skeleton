import { alternarStatusProdutoCategoria, consultarProdutoCategorias, criarProdutoCategoria, editarProdutoCategoria } from '$lib/server/db/models/produtoCategoria.js';
import { idSchema } from '$lib/zod/index.js';
import { criarCategoriaSchema, editarCategoriaSchema } from '$lib/zod/schemas/produtoCategoria.js';
import { message, setError, superValidate } from 'sveltekit-superforms/server';

export async function load({ locals }) {
  const formAdicionar = await superValidate(criarCategoriaSchema)
  const formEditar = await superValidate(editarCategoriaSchema)
  const empresa_id = locals.sessao.empresa_id
  let categorias
  const rs = consultarProdutoCategorias({ empresa_id })
  if (rs.valid) {
    categorias = rs.data
  }
  return { categorias, formAdicionar, formEditar };
};

export const actions = {
  adicionar: async ({ request, locals }) => {
    const form = await superValidate(request, criarCategoriaSchema);
    if (form.valid) {
      const criador_id = locals.sessao.uid
      const empresa_id = locals.sessao.empresa_id
      const nome = form.data.nome
      const res = criarProdutoCategoria({ nome, empresa_id, criador_id })
      if (res.valid) { return message(form, "Categoria criada com sucesso") }
      if (res.fieldErrors) {
        for (let [field, text] of Object.entries(res.fieldErrors)) setError(form, field, text)
        return message(form, res.message, { status: 400 })
      }
      return message(form, res.message, { status: 500 })
    }
    return message(form, 'Erro no preenchimento dos campos')
  },
  editar: async ({ request }) => {
    const form = await superValidate(request, editarCategoriaSchema);
    if (form.valid) {
      const res = editarProdutoCategoria(form.data)
      if (res.valid) { return message(form, "Categoria atualizada com sucesso") }
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
      const res = alternarStatusProdutoCategoria(form.data)
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
