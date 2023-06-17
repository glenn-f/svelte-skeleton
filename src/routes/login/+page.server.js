import { efetuarLogin } from '$lib/server/session'
import { redirect } from '@sveltejs/kit'
import { setError, superValidate } from 'sveltekit-superforms/server'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().nonempty("Digite a senha")
})

export async function load() {
  const form = await superValidate(loginSchema)
  return { form }
}

export const actions = {
  async login({ request, cookies }) {
    const form = await superValidate(request, loginSchema)
    // Formulário válido: verificar credenciais recebidas
    if (form.valid) {
      const sessao = await efetuarLogin(form.data.email, form.data.senha)
      // Login falhou
      if (!sessao) {
        setError(form, 'email')
        setError(form, 'senha')
        return setError(form, null, 'Credenciais inválidas.', { status: 401 })
      }
      // Login bem sucedido
      cookies.set('sid', sessao.sid, { maxAge: sessao.expiracao / 1000 })
      throw redirect(303, '/inicio')
    }
    // Formulário inválido: devolver erros para o usuário
    return { form }
  }
}
