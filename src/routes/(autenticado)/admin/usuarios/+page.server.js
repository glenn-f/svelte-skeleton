import { listarUsuarios } from '$lib/server/db';
import { PERM_APP } from '$lib/globals';
import { setError, superValidate, message } from 'sveltekit-superforms/server';
import { criarUsuario } from '$lib/server/db/index.js';
import { addUsuarioSchema } from '$lib/zodSchemas.js';

function getUsuarios() {
  const u = listarUsuarios()
  u?.forEach((u) => {
    if (PERM_APP.has(u.permUsuario)) {
      u.permUsuario = PERM_APP.get(u.permUsuario)
    } else {
      console.log(`Permissão não encontrada ou nula: ${u.permUsuario}`)
    }
  })
  return u
}

export async function load() {
  const form = await superValidate(addUsuarioSchema)
  const usuarios = getUsuarios();
  return { usuarios, form, permOptions: PERM_APP };
};

export const actions = {
  addUser: async ({ request, locals }) => {
    const form = await superValidate(request, addUsuarioSchema);
    if (form.valid) {
      const criador_id = locals.sessao.uid
      const res = criarUsuario({ criador_id, ...form.data })
      console.log(res)
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
  }
}