import { detalharEstoque } from '$lib/server/db/models/estoque';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, params }) {
    const id = parseInt(params.id)
    if (!Number.isInteger(id)) throw error(400, "ID de Estoque inválido")
    const empresa_id = locals.sessao.empresa_id
    const resEstoque = detalharEstoque({ empresa_id, id })
    if (!resEstoque.valid) throw error(500, "Erro no banco de dados")
    // console.log(resEstoque.data)
    return { estoque: resEstoque.data };
};