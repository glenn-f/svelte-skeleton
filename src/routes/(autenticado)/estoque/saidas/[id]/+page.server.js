import { ERRO_CAMPOS, ERRO_SERVIDOR, REP_COLABORADOR } from '$lib/globals.js';
import { consultarPessoas } from '$lib/server/db/models/pessoa.js';
import { detalharEntrada, estornarSaida } from '$lib/server/db/models/processoEstoque';
import { error } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import { z, zID } from '$lib/zod';
import { begin, commit, db, dbSelectAll, dbUpdate, rollback } from '$lib/server/db/index.js';
import { handleAnyError } from '$lib/helpers.js';

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
    estornar: async ({ request, params }) => {
        const id = parseInt(params.id)
        if (!Number.isInteger(id)) throw error(400, "ID de Saída inválido")
        const resultado = estornarSaida(id)
    },
    alterarVendedor: async ({ request, params }) => {
        const id = parseInt(params.id)
        const form = await superValidate(request, trocarVendedorSchema);
        if (!form.valid) return message(form, 'Erro no preenchimento dos campos', { status: ERRO_CAMPOS })
        const { responsavel_id } = form.data;
        const result = trocarVendedor({ id, responsavel_id })
        console.log(result, form.data, id)
        if (!result.valid) {
            return message(form, "Não foi possível efetuar a troca", { status: ERRO_SERVIDOR })
        }
        form.data = id;
        return message(form, 'Saída de estoque efetuada com sucesso', { status: 201 })
    }
}

const trocarVendedorSchema = z.object({
    responsavel_id: zID
})

function trocarVendedor({ id, responsavel_id }) {
    try {
        begin.run()
        if (!id || !responsavel_id) throw new Error("Um vendedor deve ser selecionado")
        let res;
        res = dbUpdate("pe", { responsavel_id }, { id })
        if (res.changes === 0) throw new Error("Não foi possível atualizar o processo de saída")
        res = dbUpdate("fe", { responsavel_id }, { pe_id: id })
        if (res.changes === 0) throw new Error("Não foi possível atualizar os itens da saída")
        commit.run()
        return { valid: true, data: id }
    } catch (e) {
        if (db.inTransaction) rollback.run()
        const { errorType, cause, fieldErrors, message } = handleAnyError(e)
        return { valid: false, fieldErrors, message, errorType, code: cause }
    }
}