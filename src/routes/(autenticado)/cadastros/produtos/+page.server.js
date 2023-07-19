import { consultarProdutos, criarProduto } from '$lib/server/db/models/produto.js';
import { consultarProdutoCategorias } from '$lib/server/db/models/produtoCategoria.js';
import { criarProdutoSchema, editarProdutoSchema } from '$lib/zod/schemas/produto.js';
import { message, setError, superValidate } from 'sveltekit-superforms/server';

export async function load({ locals }) {
    const formAdicionar = await superValidate(criarProdutoSchema)
    const formEditar = await superValidate(editarProdutoSchema)
    const eid = locals.sessao.empresa_id
    let produtos, categorias
    const rsProdutos = consultarProdutos({ eid })
    if (rsProdutos.valid) {
        produtos = rsProdutos.data
    }

    const rsCategorias = consultarProdutoCategorias({ eid })
    if (rsCategorias.valid) {
        categorias = rsCategorias.data
    }
    return { produtos, categorias, formAdicionar, formEditar };
};

/** @type {import("./$types").Actions} */
export const actions = {
    adicionar: async ({ request, locals }) => {
        const form = await superValidate(request, criarProdutoSchema);
        if (form.valid) {
          const empresa_id = locals.sessao.empresa_id
          const { nome, produto_categoria_id, titulo_codigo } = form.data
          const res = criarProduto({ nome, produto_categoria_id, titulo_codigo, empresa_id})
          if (res.ok) { return message(form, "Produto criado com sucesso") }
          if (res.errors) {
            for (let [field, text] of Object.entries(res.errors)) setError(form, field, text)
            return message(form, 'Houve problemas em alguns campos', { status: 400 })
          }
          return message(form, 'Erro no servidor. Não foi possível criar o produto', { status: 500 })
        }
        return message(form, 'Erro no preenchimento dos campos')
    }
}