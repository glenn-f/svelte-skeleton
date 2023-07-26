import { consultarGPEs } from '$lib/server/db/models/grupoPermissao';
import { alterarSenhaUsuarioEmpresa, consultarUsuariosEmpresa, criarUsuarioEmpresa, editarUsuarioEmpresa, toggleStatusUsuarioEmpresa } from '$lib/server/db/models/usuarioEmpresa';
import { idSchema } from '$lib/zod';
import { alterarSenhaUsuarioEmpresaSchema, criarUsuarioEmpresaSchema, editarUsuarioEmpresaSchema } from '$lib/zod/schemas/usuario';
import { message, setError, superValidate } from 'sveltekit-superforms/server';

export async function load({ locals }) {
  const formAdicionar = await superValidate(criarUsuarioEmpresaSchema)
  const formEditar = await superValidate(editarUsuarioEmpresaSchema)
  const empresa_id = locals.sessao.empresa_id
  let usuarios, gpes, result

  //* Consultar Usuários da Empresa
  result = consultarUsuariosEmpresa({ empresa_id })
  if (result.valid) usuarios = result.data

  //* Consultar Grupos de Permissão da Empresa
  result = consultarGPEs({ empresa_id })
  if (result.valid) gpes = result.data
  return { usuarios, gpes, formAdicionar, formEditar };
};

export const actions = {
  adicionar: async ({ request, locals }) => {
    const form = await superValidate(request, criarUsuarioEmpresaSchema);
    if (form.valid) {
      const criador_id = locals.sessao.uid
      const empresa_id = locals.sessao.empresa_id
      const { nome, email, senha, gpe_id } = form.data
      const res = criarUsuarioEmpresa({ nome, email, senha, gpe_id, criador_id, empresa_id })
      if (res.valid) { return message(form, "Usuário criado com sucesso") }
      if (res.fieldErrors) {
        for (let [field, text] of Object.entries(res.fieldErrors)) setError(form, field, text)
        return message(form, res.message, { status: 400 })
      }
      return message(form, res.message, { status: 500 })
    }
    return message(form, 'Erro no preenchimento dos campos')
  },
  editar: async ({ request, locals }) => {
    const form = await superValidate(request, editarUsuarioEmpresaSchema);
    if (form.valid) {
      const { id: usuario_id, nome, email, gpe_id } = form.data
      const empresa_id = locals.sessao.empresa_id
      const res = editarUsuarioEmpresa({ usuario_id, empresa_id, nome, email, gpe_id })
      if (res.valid) { return message(form, "Usuário alterado com sucesso") }
      if (res.fieldErrors) {
        for (let [field, text] of Object.entries(res.fieldErrors)) setError(form, field, text)
        return message(form, 'Houve problemas em alguns campos', { status: 400 })
      }
      return message(form, 'Erro no servidor. Não foi possível alterar o usuário', { status: 500 })
    }
    return message(form, 'Erro no preenchimento dos campos')
  },
  alternarStatus: async ({ request, locals }) => {
    const form = await superValidate(request, idSchema);
    if (form.valid) {
      const usuario_id = form.data.id
      const empresa_id = locals.sessao.empresa_id
      const res = toggleStatusUsuarioEmpresa({ usuario_id, empresa_id })
      if (res.valid) { return message(form, res.data) }
      if (res.fieldErrors) {
        for (let [field, text] of Object.entries(res.fieldErrors)) setError(form, field, text)
        return message(form, res.message, { status: 400 })
      }
      return message(form, res.message, { status: 500 })
    }
    return message(form, 'Erro no preenchimento dos campos')
  },
  alterarSenha: async ({ request }) => {
    const form = await superValidate(request, alterarSenhaUsuarioEmpresaSchema);
    if (form.valid) {
      const res = alterarSenhaUsuarioEmpresa(form.data)
      if (res.valid) return message(form, "Senha alterada com sucesso")
      if (res.fieldErrors) {
        for (let [field, text] of Object.entries(res.fieldErrors)) setError(form, field, text)
        return message(form, res.message, { status: 400 })
      }
      return message(form, res.message, { status: 500 })
    }
    return message(form, 'Erro no preenchimento dos campos')
  },
}