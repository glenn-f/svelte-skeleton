import { alternarStatusRegraComissao, consultarRegrasComissao, criarRegraComissao, editarRegraComissao } from '$lib/server/db/models/regra_comissao.js'
import { idSchema } from '$lib/zod'
import { criarComissaoSchema, editarComissaoSchema } from '$lib/zod/schemas/regraComissao'
import { error } from '@sveltejs/kit'
import { message, setError, superValidate } from 'sveltekit-superforms/server'

export async function load({ locals }) {
  const empresa_id = locals.sessao.empresa_id
  const res = consultarRegrasComissao({ empresa_id })
  if (!res.valid) throw error(500, "Erro no servidor")

  const contas = res.data
  const formAdicionar = await superValidate(criarComissaoSchema)
  const formEditar = await superValidate(editarComissaoSchema)
  return { contas, formAdicionar, formEditar }
}

export const actions = {
  adicionar: async ({ request, locals }) => {
    //* Validar dados recebidos
    const form = await superValidate(request, criarComissaoSchema)
    if (!form.valid) return message(form, 'Erro no preenchimento dos campos')

    //* Atualizar banco de dados
    const criador_id = locals.sessao.uid
    const empresa_id = locals.sessao.empresa_id
    const res = criarRegraComissao({ criador_id, empresa_id, ...form.data })
    //TODO tratar violações de restrições
    if (!res.valid) {
      for (let [field, text] of Object.entries(res.fieldErrors || {})) setError(form, field, text)
      return message(form, res.message, { status: 500 })
    }

    //* Enviar resposta
    return message(form, "Regra de Comissão criada com sucesso")
  },

  editar: async ({ request }) => {
    //* Validar dados recebidos
    const form = await superValidate(request, editarComissaoSchema)
    console.log(form)
    if (!form.valid) return message(form, 'Erro no preenchimento dos campos')

    //* Atualizar banco de dados
    const res = editarRegraComissao({ ...form.data })
    //TODO tratar violações de restrições
    if (!res.valid) {
      for (let [field, text] of Object.entries(res.fieldErrors || {})) setError(form, field, text)
      return message(form, res.message, { status: 500 })
    }

    //* Enviar resposta
    return message(form, "Regra de Comissão atualizada com sucesso")
  },

  alternarStatus: async ({ request }) => {
    //* Validar dados recebidos
    const form = await superValidate(request, idSchema)
    if (!form.valid) return message(form, 'Erro no preenchimento dos campos')

    //* Atualizar banco de dados
    const res = alternarStatusRegraComissao(form.data)
    //TODO tratar violações de restrições
    if (!res.valid) {
      for (let [field, text] of Object.entries(res.fieldErrors || {})) setError(form, field, text)
      return message(form, res.message, { status: 500 })
    }

    //* Enviar resposta
    return message(form, res.data)
  }

}