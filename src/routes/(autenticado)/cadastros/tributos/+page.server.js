import { alternarStatusRegraTributo, consultarRegrasTributo, criarRegraTributo, editarRegraTributo } from '$lib/server/db/models/regra_tributo'
import { idSchema } from '$lib/zod'
import { criarTributoSchema, editarTributoSchema } from '$lib/zod/schemas/regraTributo'
import { error } from '@sveltejs/kit'
import { message, setError, superValidate } from 'sveltekit-superforms/server'

export async function load({ locals }) {
  const empresa_id = locals.sessao.empresa_id
  const res = consultarRegrasTributo({ empresa_id })
  if (!res.valid) throw error(500, "Erro no servidor")

  const contas = res.data
  const formAdicionar = await superValidate(criarTributoSchema)
  const formEditar = await superValidate(editarTributoSchema)
  return { contas, formAdicionar, formEditar }
}

export const actions = {
  adicionar: async ({ request, locals }) => {
    //* Validar dados recebidos
    const form = await superValidate(request, criarTributoSchema)
    if (!form.valid) return message(form, 'Erro no preenchimento dos campos')

    //* Atualizar banco de dados
    const criador_id = locals.sessao.uid
    const empresa_id = locals.sessao.empresa_id
    const res = criarRegraTributo({ criador_id, empresa_id, ...form.data })
    //TODO tratar violações de restrições
    if (!res.valid) {
      for (let [field, text] of Object.entries(res.fieldErrors || {})) setError(form, field, text)
      return message(form, res.message, { status: 500 })
    }

    //* Enviar resposta
    return message(form, "Regra de Tributo criada com sucesso")
  },

  editar: async ({ request }) => {
    //* Validar dados recebidos
    const form = await superValidate(request, editarTributoSchema)
    console.log(form)
    if (!form.valid) return message(form, 'Erro no preenchimento dos campos')

    //* Atualizar banco de dados
    const res = editarRegraTributo({ ...form.data })
    //TODO tratar violações de restrições
    if (!res.valid) {
      for (let [field, text] of Object.entries(res.fieldErrors || {})) setError(form, field, text)
      return message(form, res.message, { status: 500 })
    }

    //* Enviar resposta
    return message(form, "Regra de Tributo atualizada com sucesso")
  },

  alternarStatus: async ({ request }) => {
    //* Validar dados recebidos
    const form = await superValidate(request, idSchema)
    if (!form.valid) return message(form, 'Erro no preenchimento dos campos')

    //* Atualizar banco de dados
    const res = alternarStatusRegraTributo(form.data)
    //TODO tratar violações de restrições
    if (!res.valid) {
      for (let [field, text] of Object.entries(res.fieldErrors || {})) setError(form, field, text)
      return message(form, res.message, { status: 500 })
    }

    //* Enviar resposta
    return message(form, res.data)
  }

}