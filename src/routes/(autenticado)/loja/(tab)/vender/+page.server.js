import { ERRO_CAMPOS, REP_CLIENTE, REP_COLABORADOR } from '$lib/globals'
import { consultarContaFormasSaida } from '$lib/server/db/models/contaForma'
import { consultarEstoqueDisponivelVenda, consultarEstoqueSimples } from '$lib/server/db/models/estoque.js'
import { consultarPessoas, criarPessoa } from '$lib/server/db/models/pessoa'
import { criarSaida } from '$lib/server/db/models/processoEstoque'
import { consultarProdutos } from '$lib/server/db/models/produto.js'
import { setDBErrors } from '$lib/zod/index.js'
import { criarClienteSchema, criarPessoaSchema } from '$lib/zod/schemas/pessoa.js'
import { criarSaidaSchema } from '$lib/zod/schemas/processoEstoque'
import { error } from '@sveltejs/kit'
import { message, superValidate } from 'sveltekit-superforms/server'

export async function load({ locals, url }) {
  const empresa_id = locals.sessao.empresa_id
  const resProdutosBuyback = consultarProdutos({ empresa_id })
  if (!resProdutosBuyback.valid) throw error(500, 'Erro no servidor')
  const produtosEntrada = resProdutosBuyback.data
  const resProdutos = consultarEstoqueDisponivelVenda({ empresa_id })
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
  const formClientes = await superValidate(criarPessoaSchema);

  let eid = parseInt(url.searchParams.get('eid'));
  eid = Number.isInteger(eid) ? consultarEstoqueSimples(eid) ?? undefined : undefined;

  return { eid, form, formClientes, produtos, produtosEntrada, colaboradores, clientes, formas }
};

export const actions = {
  addCliente: async ({ request, locals }) => {
    //* Validar Formulário
    const form = await superValidate(request, criarClienteSchema);
    if (!form.valid) return message(form, 'Erro no preenchimento dos campos', { status: ERRO_CAMPOS })
    //* Inserir dados no DB
    const empresa_id = locals.sessao.empresa_id
    const criador_id = locals.sessao.uid
    const res = criarPessoa({ ...form.data, rep: REP_CLIENTE, empresa_id, criador_id })
    if (!res.valid) {
      setDBErrors(form, res)
      return message(form, res.message, { status: res.code })
    }
    const clientes = consultarPessoas({ empresa_id }, REP_CLIENTE)
    form.data.clientes = clientes.data
    form.data.id = res.data
    //* Enviar resposta de sucesso
    return message(form, 'Cliente criado com sucesso', { status: 201 })
  },
  vender: async ({ request, locals }) => {
    //* Validar Formulário
    const form = await superValidate(request, criarSaidaSchema);
    if (!form.valid) return message(form, 'Erro no preenchimento dos campos', { status: ERRO_CAMPOS })
    //* Inserir dados no DB
    const empresa_id = locals.sessao.empresa_id
    const criador_id = locals.sessao.uid
    const res = criarSaida({ empresa_id, criador_id, ...form.data })
    if (!res.valid) {
      setDBErrors(form, res)
      return message(form, res.message, { status: res.code })
    }
    form.data = res.data
    //* Enviar resposta de sucesso
    return message(form, 'Saída de estoque efetuada com sucesso', { status: 201 })
  }
}