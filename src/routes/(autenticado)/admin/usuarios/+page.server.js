import { mapTipoUsuario } from '$lib/globals';
import { alterarStatusUsuarioDB, alterarUsuario, criarUsuario, listarUsuarios } from '$lib/server/db';
import { addUsuarioSchema, editUsuarioSchema } from '$lib/zod/schemas/usuario';
import { idSchema } from '$lib/zod';
import { message, setError, superValidate } from 'sveltekit-superforms/server';

export async function load() {
  const form = await superValidate(addUsuarioSchema)
  const usuarios = listarUsuarios();
  return { usuarios, form, permOptions: mapTipoUsuario };
};

export const actions = {
  adicionar: async ({ request, locals }) => {
    const form = await superValidate(request, addUsuarioSchema);
    if (form.valid) {
      const criador_id = locals.sessao.uid
      const res = criarUsuario({ criador_id, ...form.data })
      if (res.ok) { return message(form, res.message) }
      //* Erro no DB
      const camposMsg = res.fieldMessage ?? {}
      for (const campo in camposMsg) {
        const campoMsg = camposMsg[campo];
        setError(form, campo, campoMsg)
      }
      return message(form, res.message)
    }
    return message(form, 'Erro no preenchimento dos campos')
  },

  editar: async ({ request, locals }) => {
    const form = await superValidate(request, editUsuarioSchema);
    if (form.valid) {
      const criador_id = locals.sessao.uid
      const res = alterarUsuario({ criador_id, ...form.data })
      if (res.ok) { return message(form, res.message) }
      const camposMsg = res.fieldMessage ?? {}
      for (const campo in camposMsg) {
        const campoMsg = camposMsg[campo];
        setError(form, campo, campoMsg)
      }
      return message(form, res.message)
    }
    return message(form, 'Erro no preenchimento dos campos')
  },

  apagar: async ({ request, locals }) => {
    const form = await superValidate(request, idSchema);
    console.log(form)
    if (form.valid) {
      const res = alterarStatusUsuarioDB({ uid: locals.sessao.uid, id: form.data.id })
      if (res.ok) { return message(form, res.message) }
      //* Erro no banco
      return message(form, res.message, { status: 500 })
    }
    return message(form, 'Usuário inválido', { status: 400 })
  },
  alternarStatus: async ({ request, locals }) => {
    const form = await superValidate(request, idSchema);
    console.log(form)
    if (form.valid) {
      const res = alterarStatusUsuarioDB({ uid: locals.sessao.uid, id: form.data.id })
      if (res.ok) { return message(form, res.message) }
      //* Erro no banco
      return message(form, res.message, { status: 500 })
    }
    return message(form, 'Usuário inválido', { status: 400 })
  }
}