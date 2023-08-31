import { gerarRecibo } from '$lib/pdf.js';
import { error } from '@sveltejs/kit';

export const GET = (async ({ setHeaders }) => {
  const pdf = await gerarRecibo();

  setHeaders({
    'Content-Type': 'application/pdf',
    'Content-Length': pdf.size.toString(),
  });

  return new Response(pdf);
});