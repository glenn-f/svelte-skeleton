import { mapTipoUsuario } from '$lib/globals';
import { alternarStatusUsuario, consultarUsuarios, criarUsuario, editarUsuario } from '$lib/server/db/models/usuario';
import { idSchema } from '$lib/zod';
import { criarUsuarioSchema, editarUsuarioSchema } from '$lib/zod/schemas/usuario';
import { message, setError, superValidate } from 'sveltekit-superforms/server';

export async function load() {
  const formAdicionar = await superValidate(criarUsuarioSchema)
  const formEditar = await superValidate(editarUsuarioSchema)
  const rs = consultarUsuarios();
  const usuarios = rs.valid ? rs.data : []
  return { usuarios, formAdicionar, formEditar, permOptions: mapTipoUsuario };
};

export const actions = {
  adicionar: async ({ request, locals }) => {
    const form = await superValidate(request, criarUsuarioSchema);
    if (form.valid) {
      const criador_id = locals.sessao.uid
      const { email, nome, senha, tipo_usuario } = form.data
      const res = criarUsuario({ criador_id, email, nome, senha, tipo_usuario })
      if (res.valid) { return message(form, "Usuário criado com sucesso") }
      //* Erro no DB
      const camposMsg = res.fieldMessage ?? {}
      for (const campo in camposMsg) {
        const campoMsg = camposMsg[campo];
        setError(form, campo, campoMsg)
      }
      return message(form, res.message, { status: 500 })
    }
    return message(form, 'Erro no preenchimento dos campos', { status: 400 })
  },

  editar: async ({ request, locals }) => {
    const form = await superValidate(request, editarUsuarioSchema);
    if (form.valid) {
      const { id, email, nome, tipo_usuario, senha } = form.data
      console.log(form.data)
      if (id === locals.sessao.uid) return message(form, 'Você não pode se editar aqui. Tente em "Minha Conta"', { status: 401 })
      const res = editarUsuario({ id, email, nome, tipo_usuario, senha })
      if (res.valid) { return message(form, "Usuário atualizado com sucesso") }
      //* Erro no DB
      const camposMsg = res.fieldMessage ?? {}
      for (const campo in camposMsg) {
        const campoMsg = camposMsg[campo];
        setError(form, campo, campoMsg)
      }
      return message(form, res.message, { status: 500 })
    }
    return message(form, 'Erro no preenchimento dos campos', { status: 400 })
  },

  alternarStatus: async ({ request, locals }) => {
    const form = await superValidate(request, idSchema);
    if (form.valid) {
      const { id } = form.data
      if (id === locals.sessao.uid) return message(form, 'Você não pode se editar aqui. Tente em "Minha Conta"', { status: 401 })
      const res = alternarStatusUsuario({ id })
      if (res.valid) { return message(form, res.data) }
      //* Erro no DB
      return message(form, res.message, { status: 500 })
    }
    return message(form, 'Usuário inválido', { status: 400 })
  }
}