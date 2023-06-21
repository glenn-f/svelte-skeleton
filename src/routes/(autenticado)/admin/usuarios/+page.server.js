import { listarUsuarios } from '$lib/server/db';
import { PERM_APP } from '$lib/globals';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import { fail } from '@sveltejs/kit';

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
})

export async function load() {
  const form = await superValidate(schema)
  const usuarios = getUsuarios();
  return { usuarios, form };
};

export const actions = {
  addUser: async ({ request }) => {
    const form = await superValidate(request, schema);
    console.log(form)
    if (form.valid) {
      return { form }
    }
    return fail(400, { form })
  }
}