import { alterarUsuarioEmpresa, criarUsuarioEmpresa, toggleStatusUsuarioEmpresa } from '$lib/server/db';
import { consultarGPEs } from '$lib/server/db/models/grupoPermissao';
import { consultarUsuarios } from '$lib/server/db/models/usuarioEmpresa';
import { idSchema } from '$lib/zod';
import { criarUsuarioEmpresaSchema, editarUsuarioEmpresaSchema } from '$lib/zod/schemas/usuario';
import { message, setError, superValidate } from 'sveltekit-superforms/server';

export async function load({ locals }) {
  const form = await superValidate(criarUsuarioEmpresaSchema)
  const { empresa_id: eid } = locals.sessao
  let usuarios, gpes, result

  //* Consultar Usuários da Empresa
  result = consultarUsuarios({ eid })
  if (result.valid) { usuarios = result.data }
  //* Consultar Grupos de Permissão da Empresa
  result = consultarGPEs({ eid })
  if (result.valid) { gpes = result.data }

  return { usuarios, form, permOptions: gpes };
};

export const actions = {
  adicionar: async ({ request, locals }) => {
    const form = await superValidate(request, criarUsuarioEmpresaSchema);
    if (form.valid) {
      const criador_id = locals.sessao.uid
      const empresa_id = locals.sessao.empresa_id
      const { nome, email, senha, gpe_id } = form.data
      const res = criarUsuarioEmpresa({ nome, email, senha, gpe_id, criador_id, empresa_id })
      if (res.ok) { return message(form, "Usuário criado com sucesso") }
      if (res.errors) {
        for (let [field, text] of Object.entries(res.errors)) setError(form, field, text)
        return message(form, 'Houve problemas em alguns campos', { status: 400 })
      }
      return message(form, 'Erro no servidor. Não foi possível criar o usuário', { status: 500 })
    }
    return message(form, 'Erro no preenchimento dos campos')
  },

  editar: async ({ request, locals }) => {
    const form = await superValidate(request, editarUsuarioEmpresaSchema);
    if (form.valid) {
      const { id, nome, email, senha, gpe_id } = form.data
      const eid = locals.sessao.empresa_id
      console.log({ id, nome, email, senha, gpe_id })
      const res = alterarUsuarioEmpresa({ id, nome, email, senha, gpe_id, eid })
      if (res.ok) { return message(form, "Usuário alterado com sucesso") }
      if (res.errors) {
        for (let [field, text] of Object.entries(res.errors)) setError(form, field, text)
        return message(form, 'Houve problemas em alguns campos', { status: 400 })
      }
      return message(form, 'Erro no servidor. Não foi possível alterar o usuário', { status: 500 })
    }
    return message(form, 'Erro no preenchimento dos campos')
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