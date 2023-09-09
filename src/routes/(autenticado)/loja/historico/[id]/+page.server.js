import { gerarReciboBuyback } from '$lib/relatorios/buyback.js';
import { db } from '$lib/server/db/index.js';
import { detalharEntrada } from '$lib/server/db/models/processoEstoque';
import { error } from '@sveltejs/kit';

export async function load({ locals, params }) {
    const id = parseInt(params.id)
    if (!Number.isInteger(id)) throw error(400, "ID de Entrada inválido")
    const empresa_id = locals.sessao.empresa_id
    const resEntrada = detalharEntrada({ empresa_id, id })
    if (!resEntrada.valid) throw error(resEntrada.code, resEntrada.message)
    return { entrada: resEntrada.data };
};

export const actions = {
    reciboBuyback: async ({ params, locals }) => {
        const venda_id = params.id
        const venda = db.prepare("SELECT p.nome cliente, pe.id,strftime('%d/%m/%Y', datetime(pe.criacao/1000, 'unixepoch'), '-4 hours') data from pe left join pessoa p on p.id = pe.participante_id where pe.id = $id and pe.tipo_pe = 102").get({ id: venda_id })
        if (!venda) throw error(400, "Venda não encontrada")
        venda.empresa = locals.sessao?.empresa?.nome_fantasia ?? ''
        venda.buybacks = db.prepare("SELECT p.nome,e.codigo,e.observacoes,fe.var_qntd qntd,CAST(fe.var_custo as REAL)/10000 custo FROM fe join estoque e on e.id = fe.estoque_id join produto p on p.id = e.produto_id WHERE fe.pe_id = $id AND fe.tipo_fe = 2").all({ id: venda_id }) ?? {}
        const pdf = await gerarReciboBuyback(venda);
        return pdf.toString('base64');
    }
}