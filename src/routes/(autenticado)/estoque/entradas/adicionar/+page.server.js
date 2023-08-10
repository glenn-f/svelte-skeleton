import { ERRO_CAMPOS, REP_COLABORADOR, REP_FORNECEDOR } from '$lib/globals'
import { consultarContaFormasEntrada } from '$lib/server/db/models/contaForma'
import { consultarPessoas } from '$lib/server/db/models/pessoa'
import { criarEntrada } from '$lib/server/db/models/processoEstoque'
import { consultarProdutos } from '$lib/server/db/models/produto'
import { setDBErrors } from '$lib/zod/index.js'
import { criarEntradaSchema } from '$lib/zod/schemas/processoEstoque'
import { error } from '@sveltejs/kit'
import { message, setError, superValidate } from 'sveltekit-superforms/server'

export async function load({ locals }) {
  const empresa_id = locals.sessao.empresa_id
  const resProdutos = consultarProdutos({ empresa_id })
  if (!resProdutos.valid) throw error(500, 'Erro no servidor')
  const resPessoas = consultarPessoas({ empresa_id })
  if (!resPessoas.valid) throw error(500, 'Erro no servidor')
  const colaboradores = resPessoas.data.filter(({ rep }) => rep === REP_COLABORADOR)
  const fornecedores = resPessoas.data.filter(({ rep }) => rep === REP_FORNECEDOR)
  const resFormas = consultarContaFormasEntrada({ empresa_id })
  if (!resFormas.valid) throw error(500, 'Erro no servidor')
  const form = await superValidate(criarEntradaSchema);

  return { form, produtos: resProdutos.data, colaboradores, fornecedores, formas: resFormas.data }
};

export const actions = {
  default: async ({ request, locals }) => {
    //* Validar Formulário
    const form = await superValidate(request, criarEntradaSchema);
    if (!form.valid) return message(form, 'Erro no preenchimento dos campos', { status: ERRO_CAMPOS })

    //* Inserir dados no DB
    const empresa_id = locals.sessao.empresa_id
    const criador_id = locals.sessao.uid
    const res = criarEntrada({ empresa_id, criador_id, ...form.data })
    if (!res.valid) {
      setDBErrors(form, res)
      return message(form, res.message, { status: res.code })
    }

    form.data = res.data
    //* Enviar resposta de sucesso
    return message(form, 'Entrada de estoque efetuada com sucesso', { status: 201 })
  }
}