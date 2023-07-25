import { alternarStatusGPE, consultarGPEs, criarGPE, editarGPE } from '$lib/server/db/models/grupoPermissao.js';
import { idSchema } from '$lib/zod/index.js';
import { criarGPESchema, editarGPESchema } from '$lib/zod/schemas/gpe.js';
import { message, setError, superValidate } from 'sveltekit-superforms/server';

export async function load({ locals }) {
  const empresa_id = locals.sessao.empresa_id
  const formAdicionar = await superValidate(criarGPESchema)
  const formEditar = await superValidate(editarGPESchema)
  const rs = consultarGPEs({ empresa_id })
  return { rows: rs.data, formAdicionar, formEditar };
};

export const actions = {
  adicionar: async ({ request, locals }) => {
    const form = await superValidate(request, criarGPESchema);
    if (form.valid) {
      const criador_id = locals.sessao.uid
      const empresa_id = locals.sessao.empresa_id
      const res = criarGPE({ empresa_id, criador_id, ...form.data })
      if (res.valid) { return message(form, "Grupo criado com sucesso") }
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
  editar: async ({ request }) => {
    const form = await superValidate(request, editarGPESchema);
    if (form.valid) {
      const res = editarGPE({ ...form.data })
      if (res.valid) { return message(form, "Grupo atualizado com sucesso") }
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
  alternarStatus: async ({ request }) => {
    const form = await superValidate(request, idSchema);
    if (form.valid) {
      const { id } = form.data
      const res = alternarStatusGPE({ id })
      if (res.valid) { return message(form, res.data) }
      //* Erro no DB
      return message(form, res.message, { status: 500 })
    }
    return message(form, 'Grupo inválido', { status: 400 })
  },
}