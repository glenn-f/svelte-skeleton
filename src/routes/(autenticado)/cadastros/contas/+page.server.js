import { alternarStatusConta, consultarContas, criarConta, editarConta } from '$lib/server/db/models/conta.js'
import { idSchema } from '$lib/zod'
import { criarContaSchema, editarContaSchema } from '$lib/zod/schemas/conta.js'
import { error } from '@sveltejs/kit'
import { message, setError, superValidate } from 'sveltekit-superforms/server'

export async function load({ locals }) {
  const empresa_id = locals.sessao.empresa_id
  const res = consultarContas({ empresa_id })
  if (!res.valid) throw error(500, "Erro no servidor")

  const contas = res.data
  const formAdicionar = await superValidate(criarContaSchema)
  const formEditar = await superValidate(editarContaSchema)
  return { contas, formAdicionar, formEditar }
}

export const actions = {
  adicionar: async ({ request, locals }) => {
    //* Validar dados recebidos
    const form = await superValidate(request, criarContaSchema)
    if (!form.valid) return message(form, 'Erro no preenchimento dos campos')

    //* Atualizar banco de dados
    const criador_id = locals.sessao.uid
    const empresa_id = locals.sessao.empresa_id
    const res = criarConta({ criador_id, empresa_id, ...form.data })
    //TODO tratar violações de restrições
    if (!res.valid) {
      for (let [field, text] of Object.entries(res.fieldErrors || {})) setError(form, field, text)
      return message(form, res.message, { status: 500 })
    }

    //* Enviar resposta
    return message(form, "Conta criada com sucesso")
  },

  editar: async ({ request }) => {
    //* Validar dados recebidos
    const form = await superValidate(request, editarContaSchema)
    console.log(form)
    if (!form.valid) return message(form, 'Erro no preenchimento dos campos')

    //* Atualizar banco de dados
    const res = editarConta({ ...form.data })
    //TODO tratar violações de restrições
    if (!res.valid) {
      for (let [field, text] of Object.entries(res.fieldErrors || {})) setError(form, field, text)
      return message(form, res.message, { status: 500 })
    }

    //* Enviar resposta
    return message(form, "Conta atualizada com sucesso")
  },

  alternarStatus: async ({ request }) => {
    //* Validar dados recebidos
    const form = await superValidate(request, idSchema)
    if (!form.valid) return message(form, 'Erro no preenchimento dos campos')

    //* Atualizar banco de dados
    const res = alternarStatusConta(form.data)
    //TODO tratar violações de restrições
    if (!res.valid) {
      for (let [field, text] of Object.entries(res.fieldErrors || {})) setError(form, field, text)
      return message(form, res.message, { status: 500 })
    }

    //* Enviar resposta
    return message(form, res.data)
  }

}