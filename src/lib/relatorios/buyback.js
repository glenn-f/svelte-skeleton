

import { capitalizeFirst, formatMoeda } from '$lib/helpers';
import { gerarPDF } from '$lib/pdf';

/**
 * Cria um recibo em PDF a partir de dados de um processo de estoque (saída)
 * @param {BuybackReciboOpcoes} venda Dados da venda
 * @returns {Promise<Buffer>}
 */
export async function gerarReciboBuyback(venda) {
  let { cliente, id, data, buybacks, empresa } = venda
  cliente = capitalizeFirst(cliente)

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

/**
 * Representa uma transação de buyback de uma empresa para um cliente.
 *
 * @typedef {Object} BuybackReciboOpcoes
 * @property {string} cliente - O nome do cliente envolvido na transação.
 * @property {number} id - O ID único da transação.
 * @property {string} data - A data da transação.
 * @property {{nome:string, codigo:string, observacoes:string, qntd:number, custo:number}} buybacks - A quantidade de ações de buyback envolvidas na transação.
 * @property {string} empresa - O nome da empresa que está realizando o buyback.
 */