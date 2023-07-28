import { db } from '$lib/server/db';
import { consultarPessoas } from '$lib/server/db/models/pessoa.js';
import { idSchema } from '$lib/zod';
import { criarPessoaSchema, editarPessoaSchema } from '$lib/zod/schemas/pessoa';
import { error } from '@sveltejs/kit';
import { message, setError, superValidate } from 'sveltekit-superforms/server';

export async function load({ locals }) {
  const empresa_id = locals.sessao.empresa_id
  const res = consultarPessoas({ empresa_id })
  if (!res.valid) throw error(500, "Erro no servidor")
  
  const pessoas = res.data
  const formAdicionar = await superValidate(criarPessoaSchema)
  const formEditar = await superValidate(editarPessoaSchema)
  return { pessoas, formAdicionar, formEditar };
};



export const actions = {
  adicionar: async ({ request, locals }) => {
    const formAdicionar = await superValidate(request, criarPessoaSchema);
    if (formAdicionar.valid) {
      const criador_id = locals.sessao.uid
      const empresa_id = locals.sessao.empresa_id
      const { nome, email, senha, gpe_id } = formAdicionar.data
      const res = criarPessoa({ nome, email, senha, gpe_id, criador_id, empresa_id })
      if (res.ok) { return message(formAdicionar, "Usuário criado com sucesso") }
      if (res.errors) {
        for (let [field, text] of Object.entries(res.errors)) setError(formAdicionar, field, text)
        return message(formAdicionar, 'Houve problemas em alguns campos', { status: 400 })
      }
      return message(formAdicionar, 'Erro no servidor. Não foi possível criar o usuário', { status: 500 })
    }
    return message(formAdicionar, 'Erro no preenchimento dos campos')
  },

  editar: async ({ request, locals }) => {
    const formEditar = await superValidate(request, editarPessoaSchema);
    if (formEditar.valid) {
      const { id, nome, email, senha, gpe_id } = formEditar.data
      const eid = locals.sessao.empresa_id
      console.log({ id, nome, email, senha, gpe_id })
      const res = alterarUsuarioEmpresa({ id, nome, email, senha, gpe_id, eid })
      if (res.ok) { return message(formEditar, "Usuário alterado com sucesso") }
      if (res.errors) {
        for (let [field, text] of Object.entries(res.errors)) setError(formEditar, field, text)
        return message(formEditar, 'Houve problemas em alguns campos', { status: 400 })
      }
      return message(formEditar, 'Erro no servidor. Não foi possível alterar o usuário', { status: 500 })
    }
    return message(formEditar, 'Erro no preenchimento dos campos')
  },

  alternarStatus: async ({ request, locals }) => {
    const form = await superValidate(request, idSchema);
    if (form.valid) {
      const uid = form.data.id
      const eid = locals.sessao.empresa_id
      const res = toggleStatusUsuarioEmpresa({ uid, eid })
      if (res.ok) { return message(form, res.message) }
      if (res.errors) {
        for (let [field, text] of Object.entries(res.errors)) setError(form, field, text)
        return message(form, 'Houve problemas em alguns campos', { status: 400 })
      }
      return message(form, 'Erro no servidor. Não foi possível alterar o usuário', { status: 500 })
    }
    return message(form, 'Erro no preenchimento dos campos')
  }
}