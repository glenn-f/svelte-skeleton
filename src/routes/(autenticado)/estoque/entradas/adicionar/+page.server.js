import { REP_COLABORADOR, REP_FORNECEDOR } from '$lib/globals.js';
import { consultarContaFormasEntrada } from '$lib/server/db/models/contaForma.js';
import { consultarPessoas } from '$lib/server/db/models/pessoa.js';
import { consultarProdutos } from '$lib/server/db/models/produto';
import { error } from '@sveltejs/kit';

export async function load({ locals }) {
    const empresa_id = locals.sessao.empresa_id
    const resProdutos = consultarProdutos({ empresa_id })
    if (!resProdutos.valid) throw error(500, 'Erro no servidor')
    const resFornecedores = consultarPessoas({ empresa_id }, REP_FORNECEDOR)
    if (!resFornecedores.valid) throw error(500, 'Erro no servidor')
    const resColaboradores = consultarPessoas({ empresa_id }, REP_COLABORADOR)
    if (!resColaboradores.valid) throw error(500, 'Erro no servidor')
    const resFormas = consultarContaFormasEntrada({ empresa_id })
    if (!resFormas.valid) throw error(500, 'Erro no servidor')

    return { produtos: resProdutos.data, colaboradores: resColaboradores.data, fornecedores: resFornecedores.data, formas: resFormas.data }
};