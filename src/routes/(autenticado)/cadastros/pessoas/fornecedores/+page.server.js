import { REP_FORNECEDOR } from '$lib/globals.js';
import { consultarPessoas } from '$lib/server/db/models/pessoa.js';
import { criarPessoaSchema, editarPessoaSchema } from '$lib/zod/schemas/pessoa';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

export async function load({ locals }) {
  const empresa_id = locals.sessao.empresa_id
  const res = consultarPessoas({ empresa_id }, REP_FORNECEDOR)
  if (!res.valid) throw error(500, "Erro no servidor")
  
  const pessoas = res.data
  const formAdicionar = await superValidate(criarPessoaSchema)
  const formEditar = await superValidate(editarPessoaSchema)
  return { pessoas, formAdicionar, formEditar };
};