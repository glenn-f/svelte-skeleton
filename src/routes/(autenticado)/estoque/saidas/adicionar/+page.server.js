import { ERRO_CAMPOS, REP_CLIENTE, REP_COLABORADOR } from '$lib/globals'
import { consultarContaFormasSaida } from '$lib/server/db/models/contaForma'
import { consultarEstoqueSaida } from '$lib/server/db/models/estoque.js'
import { consultarPessoas } from '$lib/server/db/models/pessoa'
import { criarEntrada } from '$lib/server/db/models/processoEstoque'
import { consultarProdutos } from '$lib/server/db/models/produto.js'
import { setDBErrors } from '$lib/zod/index.js'
import { criarSaidaSchema } from '$lib/zod/schemas/processoEstoque'
import { error } from '@sveltejs/kit'
import { message, superValidate } from 'sveltekit-superforms/server'

export async function load({ locals }) {
  const empresa_id = locals.sessao.empresa_id
  const resProdutosBuyback = consultarProdutos({ empresa_id })
  if (!resProdutosBuyback.valid) throw error(500, 'Erro no servidor')
  const produtosEntrada = resProdutosBuyback.data
  const resProdutos = consultarEstoqueSaida({ empresa_id })
  if (!resProdutos.valid) throw error(500, 'Erro no servidor')
  const produtos = resProdutos.data
  const resPessoas = consultarPessoas({ empresa_id })
  if (!resPessoas.valid) throw error(500, 'Erro no servidor')
  const colaboradores = resPessoas.data.filter(({ rep }) => rep === REP_COLABORADOR)
  const clientes = resPessoas.data.filter(({ rep }) => rep === REP_CLIENTE)
  const resFormas = consultarContaFormasSaida({ empresa_id })
  if (!resFormas.valid) throw error(500, 'Erro no servidor')
  const formas = resFormas.data
  const form = await superValidate(criarSaidaSchema);

  return { form, produtos, produtosEntrada, colaboradores, clientes, formas }
};

export const actions = {
  default: async ({ request, locals }) => {
    //* Validar Formulário
    const form = await superValidate(request, criarSaidaSchema);
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