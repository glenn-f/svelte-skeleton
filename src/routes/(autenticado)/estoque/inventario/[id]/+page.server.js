import { ERRO_CAMPOS } from '$lib/globals';
import { db } from '$lib/server/db/index.js';
import { detalharEstoque, editarItemInventario } from '$lib/server/db/models/estoque';
import { consultarRegrasComissao } from '$lib/server/db/models/regra_comissao';
import { consultarRegrasTributo } from '$lib/server/db/models/regra_tributo';
import { setDBErrors } from '$lib/zod';
import { editarInventarioSchema } from '$lib/zod/schemas/estoque';
import { error, json } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';

export async function load({ locals, params }) {
  const id = parseInt(params.id)
  if (!Number.isInteger(id)) throw error(400, "ID de Estoque inválido")
  const empresa_id = locals.sessao.empresa_id
  const resEstoque = detalharEstoque({ empresa_id, id })
  const estoque = resEstoque.data
  const regrasComissao = consultarRegrasComissao({ empresa_id }).data
  const regrasTributo = consultarRegrasTributo({ empresa_id }).data
  if (!resEstoque.valid) throw error(500, "Erro no banco de dados")

  const formEditarItem = await superValidate(estoque, editarInventarioSchema, { errors: false })
  return { estoque: resEstoque.data, regrasComissao, regrasTributo, formEditarItem };
};

export const actions = {
  editarItem: async ({ request, locals, params }) => {
    const id = parseInt(params.id)
    if (!Number.isInteger(id)) return message(form, 'ID inválide de estoque', { status: ERRO_CAMPOS })

    const form = await superValidate(request, editarInventarioSchema);
    if (!form.valid) return message(form, 'Erro no preenchimento dos campos', { status: ERRO_CAMPOS })
    console.log(form, form.data)

    //* Inserir dados no DB
    const empresa_id = locals.sessao.empresa_id
    const criador_id = locals.sessao.uid
    const res = editarItemInventario({ id, empresa_id, criador_id, ...form.data })
    if (!res.valid) {
      setDBErrors(form, res)
      return message(form, res.message, { status: res.code })
    }

    //* Enviar resposta de sucesso
    return message(form, res.message, { status: 201 })
  },
  editarCodigo: async ({ request, locals, params }) => {
    const id = parseInt(params.id)
    if (!Number.isInteger(id)) return message(form, 'ID inválide de estoque', { status: ERRO_CAMPOS })

    const form = await request.formData();
    const codigo = form.get('codigo')
    if (!codigo) return message(form, 'Código inválido', { status: ERRO_CAMPOS })

    //* Atualizar código do estoque no DB
    const empresa_id = locals.sessao.empresa_id
    const res = db.prepare("UPDATE estoque SET codigo = $codigo WHERE id = $id").run({ id, codigo })
    if (res.changes == 0) return message(form, 'Estoque não encontrado', { status: ERRO_CAMPOS })

    //* Enviar resposta de sucesso
    return { message: 'Código atualizado com sucesso' };
  }
}