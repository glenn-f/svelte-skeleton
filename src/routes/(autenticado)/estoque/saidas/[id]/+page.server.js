import { REP_COLABORADOR } from '$lib/globals.js';
import { consultarPessoas } from '$lib/server/db/models/pessoa.js';
import { detalharEntrada } from '$lib/server/db/models/processoEstoque';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z, zID } from '$lib/zod';

export async function load({ locals, params }) {
    const id = parseInt(params.id)
    if (!Number.isInteger(id)) throw error(400, "ID de Entrada inválido")
    const empresa_id = locals.sessao.empresa_id
    const resEntrada = detalharEntrada({ empresa_id, id })
    if (!resEntrada.valid) throw error(resEntrada.code, resEntrada.message)
    const resPessoas = consultarPessoas({ empresa_id })
    if (!resPessoas.valid) throw error(500, 'Erro no servidor')
    const colaboradores = resPessoas.data.filter(({ rep }) => rep === REP_COLABORADOR)
    // console.log(resEntrada.data)
    const form = await superValidate(trocarVendedorSchema);
    return { form, entrada: resEntrada.data, colaboradores };
};
export const actions = {
    estornar: async ({ request }) => {
        const data = await request.formData();
        console.log(data)
    },
    alterarVendedor: async ({ request }) => {
        const form = await superValidate(request, trocarVendedorSchema);
        console.log(form)
        return { form }
    }
}

const trocarVendedorSchema = z.object({
    responsavel_id: zID
})