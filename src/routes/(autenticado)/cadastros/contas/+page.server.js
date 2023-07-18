import { consultarContas } from '$lib/server/db/models/conta.js';

export async function load({ locals }) {
    const eid = locals.sessao.empresa_id
    const res = consultarContas({ eid })
    let contas
    if (res.valid) {
        contas = res.data
    }
    return { produtos: contas };
};