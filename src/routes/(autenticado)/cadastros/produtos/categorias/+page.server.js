import { consultarProdutoCategorias, criarProdutoCategoria } from '$lib/server/db/models/produtoCategoria.js';
import { criarCategoriaSchema, editarCategoriaSchema } from '$lib/zod/schemas/produtoCategoria.js';
import { message, setError, superValidate } from 'sveltekit-superforms/server';

export async function load({ locals }) {
    const formAdicionar = await superValidate(criarCategoriaSchema)
    const formEditar = await superValidate(editarCategoriaSchema)
    const eid = locals.sessao.empresa_id
    let categorias
    const rs = consultarProdutoCategorias({ eid })
    if (rs.valid) {
        categorias = rs.data
    }

    return { categorias, formAdicionar, formEditar };
};

/** @type {import("./$types").Actions} */
export const actions = {
    adicionar: async ({ request, locals }) => {
        const form = await superValidate(request, criarCategoriaSchema);
        if (form.valid) {
          const empresa_id = locals.sessao.empresa_id
          const { nome } = form.data
          const res = criarProdutoCategoria({ nome, empresa_id})
          if (res.ok) { return message(form, "Categoria criada com sucesso") }
          if (res.errors) {
            for (let [field, text] of Object.entries(res.errors)) setError(form, field, text)
            return message(form, 'Houve problemas em alguns campos', { status: 400 })
          }
          return message(form, 'Erro no servidor. Não foi possível criar a categoria', { status: 500 })
        }
        return message(form, 'Erro no preenchimento dos campos')
    }
}