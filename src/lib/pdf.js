import PdfPrinter from 'pdfmake';
import path from "node:path";
import { cwd } from 'node:process';

const fonts = {
  // Quicksand: {
  //   normal: path.join(cwd(), "/static/fonts/Quicksand.ttf"),
  //   bold: path.join(cwd(), "/static/fonts/Quicksand-Bold.ttf"),
  // },
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  },
};
const printer = new PdfPrinter(fonts);

/**@type {import('pdfmake/interfaces').TDocumentDefinitions.styles} */
const styles = {
  h1: {
    fontSize: 18,
    bold: true,
    margin: [0, 0, 0, 16]
  },
  h2: {
    fontSize: 16,
    margin: [0, 10, 0, 10]
  },
  table: {
    lineHeight: 1,
    alignment: 'center',
  },
  tableHeader: {
    bold: true,
    fillColor: '#e7e7e7',
  },
  link: {
    decoration: 'underline',
    color: 'blue'
  },
  bold: {
    bold: true,
  }
}

const defaultStyle = {
  font: 'Helvetica',
  alignment: 'justify',
  lineHeight: 1.3,
}

/**
 * Cria um PDF com PDFmake a partir das definições de documento e retorna uma promise que resolverá em um Buffer do PDF.
 * @param {import('pdfmake/interfaces').TDocumentDefinitions} docDefinition Definições de documento PDF do PDFMake
 * @returns {Promise<Buffer>} Promise que resolverá em um Buffer do PDF gerado
 */
export async function gerarPDF(docDefinition) {
  const { styles: docStyles, defaultStyle: docDefaultStyle, ...restDef } = docDefinition
  const def = { defaultStyle: { ...defaultStyle, ...docDefaultStyle }, styles: { ...styles, ...docStyles }, ...restDef }
  return new Promise((resolve, reject) => {
    const pdf = printer.createPdfKitDocument(def);
    const chunks = []
    pdf.on("data", (chunk) => chunks.push(chunk))
    pdf.on("error", (e) => { console.error(e); reject(e); })
    pdf.on("end", () => resolve(Buffer.concat(chunks)))
    pdf.end();
  });
}
