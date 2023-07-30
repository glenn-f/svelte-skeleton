import { consultarContas } from '$lib/server/db/models/conta.js'
import { alternarStatusContaForma, consultarContaFormas, criarContaForma, editarContaForma } from '$lib/server/db/models/contaForma.js'
import { idSchema } from '$lib/zod'
import { criarContaFormaSchema, editarContaFormaSchema } from '$lib/zod/schemas/contaFormas.js'
import { error } from '@sveltejs/kit'
import { message, setError, superValidate } from 'sveltekit-superforms/server'

export async function load({ locals }) {
  const empresa_id = locals.sessao.empresa_id
  const resFormas = consultarContaFormas({ empresa_id })
  if (!resFormas.valid) throw error(500, "Erro no servidor")

  const resContas = consultarContas({ empresa_id })
  if (!resContas.valid) throw error(500, "Erro no servidor")

  const formas = resFormas.data
  const contas = resContas.data
  const formAdicionar = await superValidate(criarContaFormaSchema)
  const formEditar = await superValidate(editarContaFormaSchema)
  return { formas, contas, formAdicionar, formEditar }
}

export const actions = {
  adicionar: async ({ request, locals }) => {
    //* Validar dados recebidos
    const form = await superValidate(request, criarContaFormaSchema)
    if (!form.valid) return message(form, 'Erro no preenchimento dos campos')

    //* Atualizar banco de dados
    const criador_id = locals.sessao.uid
    const res = criarContaForma({ criador_id, ...form.data })
    //TODO tratar violações de restrições
    if (!res.valid) {
      for (let [field, text] of Object.entries(res.fieldErrors || {})) setError(form, field, text)
      return message(form, res.message, { status: 500 })
    }

    //* Enviar resposta
    return message(form, "Forma de Transação criada com sucesso")
  },

  editar: async ({ request, locals }) => {
    //* Validar dados recebidos
    const form = await superValidate(request, editarContaFormaSchema)
    if (!form.valid) return message(form, 'Erro no preenchimento dos campos')

    //* Atualizar banco de dados
    const criador_id = locals.sessao.uid
    const res = editarContaForma({ criador_id, ...form.data })
    //TODO tratar violações de restrições
    if (!res.valid) {
      for (let [field, text] of Object.entries(res.fieldErrors || {})) setError(form, field, text)
      return message(form, res.message, { status: 500 })
    }

    //* Enviar resposta
    return message(form, "Forma de Transação atualizada com sucesso")
  },

  alternarStatus: async ({ request }) => {
    //* Validar dados recebidos
    const form = await superValidate(request, idSchema)
    if (!form.valid) return message(form, 'Erro no preenchimento dos campos')

    //* Atualizar banco de dados
    const res = alternarStatusContaForma(form.data)
    //TODO tratar violações de restrições
    if (!res.valid) {
      for (let [field, text] of Object.entries(res.fieldErrors || {})) setError(form, field, text)
      return message(form, res.message, { status: 500 })
    }

    //* Enviar resposta
    return message(form, res.data)
  }

}