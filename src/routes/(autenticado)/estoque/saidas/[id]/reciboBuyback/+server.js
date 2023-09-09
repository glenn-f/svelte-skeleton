import { gerarReciboBuyback } from '$lib/relatorios/buyback.js';
import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const GET = (async ({ setHeaders, locals, params }) => {
  const venda_id = params.id
  const venda = db.prepare("SELECT p.nome cliente, pe.id,strftime('%d/%m/%Y', datetime(pe.criacao/1000, 'unixepoch'), '-4 hours') data from pe left join pessoa p on p.id = pe.participante_id where pe.id = $id and pe.tipo_pe = 102").get({ id: venda_id })
  if (!venda) throw error(400, "Venda não encontrada")
  venda.empresa = locals.sessao?.empresa?.nome_fantasia ?? ''
  venda.buybacks = db.prepare("SELECT p.nome,e.codigo,e.observacoes,fe.var_qntd qntd,CAST(fe.var_custo as REAL)/10000 custo FROM fe join estoque e on e.id = fe.estoque_id join produto p on p.id = e.produto_id WHERE fe.pe_id = $id AND fe.tipo_fe = 2").all({ id: venda_id }) ?? {}
  const pdf = await gerarReciboBuyback(venda);

  setHeaders({
    'Content-Type': 'application/pdf',
    'Content-Length': pdf.length ?? 0,
    // 'Content-Disposition': `attachment; filename="recibo-buyback-${venda_id}.pdf"`
  });

  return new Response(pdf);
});
