import { efetuarLogin, sessionCookieSettings } from '$lib/server/loginSessao'
import { loginSchema } from '$lib/zod/schemas/usuario'
import { redirect } from '@sveltejs/kit'
import { message, setError, superValidate } from 'sveltekit-superforms/server'

export async function load() {
  const form = await superValidate(loginSchema)
  return { form, title: "Autenticação" }
}

export const actions = {
  async login({ request, cookies }) {
    const form = await superValidate(request, loginSchema)
    if (form.valid) {
      const { email, senha } = form.data
      // Formulário válido: verificar credenciais recebidas
      const rs = await efetuarLogin(email, senha)
      if (rs.valid) {
        // Login bem sucedido
        const sessao = rs.data
        cookies.set('sid', sessao.sid, { ...sessionCookieSettings, maxAge: sessao.expiracao / 1000 })
        throw redirect(303, '/inicio')
      } else {
        // Login falhou
        setError(form, 'email')
        setError(form, 'senha')
        return message(form, rs.message, { status: 401 })
      }
    }
    // Formulário inválido: devolver erros para o usuário
    return message(form, 'Preenchimento inválido', { status: 400 })
  }
}
