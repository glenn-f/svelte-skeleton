import { consultarProdutos } from '$lib/server/db/models/produto.js';
import { consultarProdutoCategorias } from '$lib/server/db/models/produtoCategoria.js';
import { criarProdutoSchema, editarProdutoSchema } from '$lib/zod/schemas/produto.js';
import { superValidate } from 'sveltekit-superforms/server';

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