import moment from 'moment/moment'
import { setError, superValidate } from 'sveltekit-superforms/server'
import { z } from 'zod'
import { verificarCredencialUsuario } from "$lib/server/db";
import { criarSessao } from '$lib/server/session';
import { redirect } from '@sveltejs/kit';

const schema = z.object({
  email: z.string().email(),
  senha: z.string()
})

/** @type {import("./$types").PageServerLoad} */
export async function load() {
  const form = await superValidate(schema)
  return { form }
}

/** @type {import("./$types").Actions} */
export const actions = {
  async login({ request, cookies }) {
    const form = await superValidate(request, schema)
    console.log('|' + moment().format("yyyy-MM-DD hh:mm") + '|', "POST", form)

    if (form.valid) {
      const usuarioValido = await verificarCredencialUsuario(form.data.email, form.data.senha)
      if (!usuarioValido) {
        setError(form, 'email', '')
        return setError(form, 'senha', 'Credenciais inválidas.', { status: 401 })
      }
      const maxAge = 60 * 60; // 1 hora
      const sid = criarSessao(form.data.email, maxAge, usuarioValido);
      cookies.set('sid', sid, { maxAge });
      throw redirect(303, '/')
    }
    setError(form, 'email', '')
    return setError(form, 'senha', 'Preenchimento inválido.', { status: 401 })
  }
}
