import { ERRO_CAMPOS, REP_COLABORADOR } from '$lib/globals';
import { consultarContaFormasEntrada } from '$lib/server/db/models/contaForma.js';
import { detalharEstoque } from '$lib/server/db/models/estoque';
import { consultarPessoas } from '$lib/server/db/models/pessoa.js';
import { criarEntrada, criarLancamentoInventario } from '$lib/server/db/models/processoEstoque.js';
import { setDBErrors } from '$lib/zod/index.js';
import { criarLancamentoSchema } from '$lib/zod/schemas/processoEstoque.js';
import { error } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';

export async function load({ locals, params }) {
  const id = parseInt(params.id)
  if (!Number.isInteger(id)) throw error(400, "ID de Estoque inválido")
  const empresa_id = locals.sessao.empresa_id

  const resEstoque = detalharEstoque({ empresa_id, id })
  if (!resEstoque.valid) throw error(500, "Erro no banco de dados")
  const estoque = resEstoque.data

  const resPessoas = consultarPessoas({ empresa_id })
  if (!resPessoas.valid) throw error(500, 'Erro no servidor')
  const colaboradores = resPessoas.data.filter(({ rep }) => rep === REP_COLABORADOR)

  const resFormas = consultarContaFormasEntrada({ empresa_id })
  if (!resFormas.valid) throw error(500, 'Erro no servidor')
  const formas = resFormas.data

  const form = await superValidate(criarLancamentoSchema);

  return { estoque, colaboradores, form, formas };
};

export const actions = {
  default: async ({ request, locals, params }) => {
    const id = parseInt(params.id)
    if (!Number.isInteger(id)) return message(form, 'ID inválido de estoque', { status: ERRO_CAMPOS })

    //* Validar Formulário
    const form = await superValidate(request, criarLancamentoSchema);
    if (!form.valid) return message(form, 'Erro no preenchimento dos campos', { status: ERRO_CAMPOS })

    //* Inserir dados no DB
    const empresa_id = locals.sessao.empresa_id
    const criador_id = locals.sessao.uid
    const res = criarLancamentoInventario({ id, empresa_id, criador_id, ...form.data })
    if (!res.valid) {
      setDBErrors(form, res)
      return message(form, res.message, { status: res.code })
    }

    form.data = res.data
    //* Enviar resposta de sucesso
    return message(form, 'Lançamento em inventário efetuado com sucesso', { status: 201 })
  }
}