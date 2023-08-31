import PdfPrinter from 'pdfmake';
import blobStream from 'blob-stream';
import path from "node:path";
import { cwd } from 'node:process';

const fonts = {
  Quicksand: {
    normal: path.join(cwd(), "/static/fonts/Quicksand.ttf"),
    bold: path.join(cwd(), "/static/fonts/Quicksand-Bold.ttf"),
  }
};
const printer = new PdfPrinter(fonts);

async function blobToBase64(blob) {
  const buffer = Buffer.from(await blob.arrayBuffer());
  return `data:${blob.type};base64,${buffer.toString('base64')}`;
}

export async function gerarRecibo(albumId) {
  let cliente = "Fernando"
  let vendedor = "Fulano"
  let loja = "Deluxe Cases"
  let modelo = "Iphone Xr"
  let codigo = "ASD86LN91HD81HXA98K"
  let observacoes = "Odeio iPHONE"
  let valor = "R$ 1.235,12"
  let total = "R$ 2.700,99"
  let forma = "Crédito Visa/Master 5x"
  const file = {
    content: [
      { text: "Recibo de Troca (Buyback)", style: 'h1' },
      { text: `Data: 24/02/2002` },
      `Número do Recibo: 1524515`,
      { text: ["Eu, ", { text: cliente, bold: true }, { text: `, adiante denominado "Cliente", declaro ter entregado o seguinte dispositivo como parte do pagamento para a compra de um novo iPhone:` }] },
      "\n",
      `Dispositivo Antigo:`,
      `- Modelo: ${modelo}`,
      `- Número de Série / IMEI: ${codigo}`,
      `- Observações: ${observacoes}`,
      `\n`,
      `A ${loja}, adiante denominada "Loja", declara ter recebido o dispositivo acima mencionado nas condições especificadas, sujeito à avaliação e confirmação.`,
      `\n`,
      `Valor Acordado para a Troca: ${valor}`,
      `Total do Novo Produto: ${total}`,
      `\n`,
      `O Cliente concorda em pagar o Valor Pago pela Diferença, equivalente à diferença entre o Total do Novo Produto e o Valor Acordado para a Troca, por meio da Forma de Pagamento especificada abaixo.`,
      `\n`,
      `Forma de Pagamento: ${forma}`,
      `\n`,
      `O Cliente declara que o dispositivo antigo foi redefinido para os padrões de fábrica, excluindo todos os dados pessoais.`,
      `\n`,
      `A loja não se responsabiliza por dados pessoais deixados no dispositivo antigo após a troca.`,
      `A Loja compromete-se a revender ou reciclar o dispositivo antigo de maneira apropriada, de acordo com suas políticas internas.`,
      `\n`,
      `O Cliente reconhece que quaisquer danos não mencionados na avaliação inicial podem afetar o valor final da troca.`,
      `\n`,
      `Este recibo é emitido com o propósito de documentar a transação e não constitui uma renúncia a quaisquer direitos ou responsabilidades de ambas as partes.`,
      `\n`,
      {
        table: {
          headerRows: 0,
          body: [
            [
              { text: '______________________________' },
              { text: '______________________________', },
            ],
            [
              { text: `Cliente: ${cliente}` },
              { text: `Representante da Loja: ${vendedor}`, },
            ],
          ],

        },
      },
      // {
      //   table: {
      //     headerRows: 1,
      //     body: [
      //       [
      //         { text: '#', style: 'tableHeader' },
      //         { text: 'Name', style: 'tableHeader' },
      //         { text: 'Seconds', style: 'tableHeader' }
      //       ],
      //     ]
      //   },
      //   layout: 'headerLineOnly'
      // },
      // { text: 'Other Albums by this Artist', style: 'h2' },
      // {
      //   ul: [].map((a) => ({
      //     text: a.albumTitle,
      //     link: `http://localhost:5173/album/15`,
      //     style: 'link'
      //   }))
      // }
    ],
    styles: {
      h1: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 16]
      },
      h2: {
        fontSize: 16,
        margin: [0, 10, 0, 10]
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: 'black',
        fillColor: '#e7e7e7',
        margin: [0, 2, 0, 2]
      },
      link: {
        decoration: 'underline',
        color: 'blue'
      },
      bold: {
        bold: true,
      }
    },
    defaultStyle: {
      font: 'Quicksand'
    }
  };

  return new Promise((resolve, reject) => {
    const pdf = printer.createPdfKitDocument(file);

    pdf
      .pipe(blobStream())
      .on('finish', function () {
        console.log('Finished generating PDF');
        resolve(this.toBlob('application/pdf'));
      })
      .on('error', (err) => {
        console.error('err', err);
        reject(err);
      });

    pdf.end();
  });
}
