import { efetuarLogin, sessionCookieSettings } from '$lib/server/session'
import { loginSchema } from '$lib/zod/schemas/usuario'
import { redirect } from '@sveltejs/kit'
import { message, setError, superValidate } from 'sveltekit-superforms/server'

export async function load() {
  const form = await superValidate(loginSchema)
  return { form }
}

export const actions = {
  async login({ request, cookies }) {
    const form = await superValidate(request, loginSchema)
    if (form.valid) {
      // Formulário válido: verificar credenciais recebidas
      const sessao = await efetuarLogin(form.data.email, form.data.senha)
      if (!sessao) {
        // Login falhou
        setError(form, 'email')
        setError(form, 'senha')
        return message(form, 'Credenciais inválidas', { status: 401 })
      }
      // Login bem sucedido
      cookies.set('sid', sessao.sid, { ...sessionCookieSettings, maxAge: sessao.expiracao / 1000 })
      throw redirect(303, '/inicio')
    }
    // Formulário inválido: devolver erros para o usuário
    return message(form, 'Preenchimento inválido', { status: 400 })
  }
}
