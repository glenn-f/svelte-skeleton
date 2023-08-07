import { detalharEntrada } from '$lib/server/db/models/processoEstoque';
import { error } from '@sveltejs/kit';

export async function load({ locals, params }) {
    const id = parseInt(params.id)
    if (!Number.isInteger(id)) throw error(400, "ID de Entrada inválido")
    const empresa_id = locals.sessao.empresa_id
    const resEntrada = detalharEntrada({ empresa_id, id })
    if (!resEntrada.valid) throw error(resEntrada.code, resEntrada.message)
    // console.log(resEntrada.data)
    return { entrada: resEntrada.data };
};