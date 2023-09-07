import { formatMoeda } from '$lib/helpers';
import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import { gerarPDF } from "$lib/pdf"

export const GET = (async ({ setHeaders, locals, params }) => {
  const venda_id = params.id
  const venda = db.prepare("SELECT p.nome cliente, pe.id,strftime('%d/%m/%Y', datetime(pe.criacao/1000, 'unixepoch'), '-4 hours') data from pe left join pessoa p on p.id = pe.participante_id where pe.id = $id and pe.tipo_pe = 102").get({ id: venda_id })
  if (!venda) throw error(400, "Venda não encontrada")
  venda.empresa = locals.sessao?.empresa?.nome_fantasia ?? ''
  venda.buybacks = db.prepare("SELECT p.nome,e.codigo,e.observacoes,fe.var_qntd qntd,CAST(fe.var_custo as REAL)/10000 custo FROM fe join estoque e on e.id = fe.estoque_id join produto p on p.id = e.produto_id WHERE fe.pe_id = $id AND fe.tipo_fe = 2").all({ id: venda_id }) ?? {}
  const pdf = await gerarRecibo(venda);

  setHeaders({
    'Content-Type': 'application/pdf',
    'Content-Length': pdf.length ?? 0,
    // 'Content-Disposition': `attachment; filename="recibo-buyback-${venda_id}.pdf"`
  });

  return new Response(pdf);
});


async function gerarRecibo(venda) {
  let { cliente, id, data, buybacks, empresa } = venda
  const tableBuybacks = buybacks.map(b => ([b.nome ?? '', b.codigo ?? '', b.observacoes ?? '', b.qntd?.toString() ?? '', formatMoeda(b.custo ?? 0)]))
  const tableTotal = formatMoeda(buybacks.reduce((acc, b) => acc + (b.qntd * b.custo), 0) ?? 0)
  /** @type {import('pdfmake/interfaces').TDocumentDefinitions} */
  const file = {
    pageMargins: [20, 15],
    content: [
      { text: "Recibo de Troca (Buyback)", style: 'h1', alignment: "center" },
      {
        columns: [
          { text: [{ text: `Data: `, bold: true }, { text: data }], width: "auto" },
          { text: "", width: "*" },
          { text: [{ text: `Número da Venda: `, bold: true }, { text: id }], width: "auto" },
        ]
      },
      "\n",
      { text: ["Eu, ", { text: cliente, bold: true }, { text: `, adiante denominado "Cliente", declaro ter entregado os seguintes dispositivos como parte do pagamento da compra descrita neste documento:` }] },
      "\n",
      {
        style: 'table',
        table: {
          headerRows: 1,
          widths: ['*', 'auto', 150, 'auto', 'auto'],
          body: [
            [{ style: 'tableHeader', text: 'Produto' }, { style: 'tableHeader', text: 'Código' }, { style: 'tableHeader', text: 'Observações' }, { style: 'tableHeader', text: 'Qntd.' }, { style: 'tableHeader', text: 'Valor' },],
            ...tableBuybacks,
            [{ colSpan: 4, text: "Total", bold: true, alignment: 'right' }, '', '', '', tableTotal],
          ]
        }
      },
      `\n`,
      `Os produtos acima foram redefinidos pelo Cliente para os padrões de fábrica, excluindo todos os dados pessoais.`,
      `O Cliente reconhece que quaisquer danos não mencionados na avaliação inicial podem afetar o valor final da troca.`,
      `\n`,
      { text: [`A `, { text: `${empresa}`, bold: true }, `, adiante denominada "Loja", declara ter recebido o(s) dispositivo(s) acima mencionado(s) nas condições especificadas, sujeito à avaliação e confirmação.`] },
      `A Loja não se responsabiliza por dados pessoais deixados no dispositivo antigo após a troca.`,
      `A Loja compromete-se a revender ou reciclar os produtos recebidos de maneira apropriada, de acordo com suas políticas internas.`,
      `\n`,
      `Este recibo é emitido com o propósito de documentar a transação e não constitui uma renúncia a quaisquer direitos ou responsabilidades de ambas as partes.`,
      `\n`,
      `\n`,
      `\n`,
      `\n`,
      {
        columns: [
          { text: '_____________________________________', alignment: 'center', marginBottom: 4 },
          { text: '_____________________________________', alignment: 'center', marginBottom: 4 },
        ],
      },
      {
        columns: [
          { text: `${cliente ?? ''} (Cliente)`, alignment: 'center' },
          { text: 'Representante da Loja', alignment: 'center' },
        ],
      },
    ],
  };

  return gerarPDF(file);
}