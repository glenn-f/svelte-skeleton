import { alternarStatusPessoa, consultarPessoas, criarPessoa, editarPessoa } from '$lib/server/db/models/pessoa'
import { idSchema } from '$lib/zod'
import { criarPessoaSchema, editarPessoaSchema } from '$lib/zod/schemas/pessoa'
import { error } from '@sveltejs/kit'
import { message, setError, superValidate } from 'sveltekit-superforms/server'

export async function load({ locals }) {
  const empresa_id = locals.sessao.empresa_id
  const res = consultarPessoas({ empresa_id })
  if (!res.valid) throw error(500, "Erro no servidor")

  const pessoas = res.data
  const formAdicionar = await superValidate(criarPessoaSchema)
  const formEditar = await superValidate(editarPessoaSchema)
  return { pessoas, formAdicionar, formEditar }
}

export const actions = {
  adicionar: async ({ request, locals }) => {
    //* Validar dados recebidos
    const form = await superValidate(request, criarPessoaSchema)
    if (!form.valid) return message(form, 'Erro no preenchimento dos campos')

    //* Atualizar banco de dados
    const criador_id = locals.sessao.uid
    const empresa_id = locals.sessao.empresa_id
    const res = criarPessoa({ criador_id, empresa_id, ...form.data })
    //TODO tratar violações de restrições
    if (!res.valid) {
      for (let [field, text] of Object.entries(res.fieldErrors || {})) setError(form, field, text)
      return message(form, res.message, { status: 500 })
    }

    //* Enviar resposta
    return message(form, "Pessoa criada com sucesso")
  },

  editar: async ({ request }) => {
    //* Validar dados recebidos
    const form = await superValidate(request, editarPessoaSchema)
    console.log(form)
    if (!form.valid) return message(form, 'Erro no preenchimento dos campos')

    //* Atualizar banco de dados
    const res = editarPessoa({ ...form.data })
    //TODO tratar violações de restrições
    if (!res.valid) {
      for (let [field, text] of Object.entries(res.fieldErrors || {})) setError(form, field, text)
      return message(form, res.message, { status: 500 })
    }

    //* Enviar resposta
    return message(form, "Pessoa atualizada com sucesso")
  },

  alternarStatus: async ({ request }) => {
    //* Validar dados recebidos
    const form = await superValidate(request, idSchema)
    if (!form.valid) return message(form, 'Erro no preenchimento dos campos')

    //* Atualizar banco de dados
    const res = alternarStatusPessoa(form.data)
    //TODO tratar violações de restrições
    if (!res.valid) {
      for (let [field, text] of Object.entries(res.fieldErrors || {})) setError(form, field, text)
      return message(form, res.message, { status: 500 })
    }

    //* Enviar resposta
    return message(form, res.data)
  }

}