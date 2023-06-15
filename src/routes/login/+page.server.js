import { setError, superValidate } from 'sveltekit-superforms/server'
import { z } from 'zod'
import { verificarCredencialUsuario } from '$lib/server/db'
import { criarSessao } from '$lib/server/session'
import { redirect } from '@sveltejs/kit'

const maxAge = 60 * 60
const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string()
})

export async function load() {
  const form = await superValidate(loginSchema)
  return { form }
}

export const actions = {
  async login({ request, cookies }) {
    const form = await superValidate(request, loginSchema)

    if (form.valid) {
      const usuarioValido = await verificarCredencialUsuario(form.data.email, form.data.senha)
      if (!usuarioValido) {
        setError(form, 'email', '')
        return setError(form, 'senha', 'Credenciais inválidas.', { status: 401 })
      }
      const sid = criarSessao(form.data.email, maxAge, usuarioValido)
      cookies.set('sid', sid, { maxAge })
      throw redirect(303, '/inicio')
    }
    setError(form, 'email', '')
    return setError(form, 'senha', 'Preenchimento inválido.', { status: 401 })
  }
}
