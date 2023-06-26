import { listarUsuarios } from '$lib/server/db';
import { PERM_APP } from '$lib/globals';
import { setError, superValidate, message } from 'sveltekit-superforms/server';
import { z } from 'zod';
import { fail } from '@sveltejs/kit';
import { criarUsuario } from '../../../../lib/server/db/index.js';

function getUsuarios() {
  const u = listarUsuarios()
  u?.forEach((u) => {
    if (u.id === 0) {
      u.permUsuario = "Administrador"
    } else if (u.permUsuario in PERM_APP) {
      u.permUsuario = PERM_APP[u.permUsuario]
    } else {
      console.log(`Permissão não encontrada ou nula: ${u.permUsuario}`)
    }
  })
  return u
}

const schema = z.object({
  nome: z.string().trim().min(5),
  email: z.string().email(),
  senha: z.string().nonempty("Digite a senha"),
  senha_repetir: z.string().nonempty("Digite a senha"),
  permUsuario: z.coerce.number(),
}).refine((obj) => obj.senha === obj.senha_repetir, {
  message: "As senhas não correspondem.",
  path: ["senha_repetir"],
})

export async function load() {
  const form = await superValidate(schema)
  const usuarios = getUsuarios();
  return { usuarios, form, permOptions: PERM_APP };
};

export const actions = {
  addUser: async ({ request }) => {
    const form = await superValidate(request, schema);
    if (form.valid) {
      const { ok, message: msg, type, fieldMessage, id } = criarUsuario(form.data)
      if (ok) { message(form, { message: msg, type, id }) }
      //* Erro no DB
      for (const campo in fieldMessage ?? {}) {
        const erroCampo = fieldMessage[campo];
        setError(form, campo, erroCampo)
      }
      // delete form.data.senha
      // delete form.data.senha
      return message(form, { message: msg, type })
    }
    return message(form, { message: 'Erro no preenchimento dos campos', type: 'error' })
  }
}