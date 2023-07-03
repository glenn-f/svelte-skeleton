import { PERM_APP } from '$lib/globals';
import { alterarStatusUsuarioDB, alterarUsuario, criarUsuario, listarUsuarios, db } from '$lib/server/db';
import { addUsuarioSchema, deleteIdSchema, editUsuarioSchema } from '$lib/zodSchemas';
import { message, setError, superValidate } from 'sveltekit-superforms/server';

export async function load({ locals }) {
  const form = await superValidate(addUsuarioSchema)
  const { empresa_id: eid, empresa_perm, perm: app_perm, uid } = locals.sessao

  //* Pegar usuários desta empresa
  const query = db.prepare('SELECT ue.perm_empresa, ue.criacao associacao, ue.delecao desativacao, u.id, u.nome, u.email, u.perm_usuario, u.criador_id, c.nome criador_nome FROM usuario u JOIN usuario_empresa ue ON ue.usuario_id = u.id left join usuario c on c.id = u.criador_id WHERE ue.empresa_id = $eid')
  const usuarios = query.all({ eid })
  return { usuarios, form, permOptions: PERM_APP };
};

export const actions = {
  adicionar: async ({ request, locals }) => {
    const form = await superValidate(request, addUsuarioSchema);
    if (form.valid) {
      const criador_id = locals.sessao.uid
      const res = criarUsuario({ criador_id, ...form.data })
      if (res.ok) { return message(form, res.message) }
      //* Erro no DB
      const camposMsg = res.fieldMessage ?? {}
      for (const campo in camposMsg) {
        const campoMsg = camposMsg[campo];
        setError(form, campo, campoMsg)
      }
      return message(form, res.message)
    }
    return message(form, 'Erro no preenchimento dos campos')
  },

  editar: async ({ request, locals }) => {
    const form = await superValidate(request, editUsuarioSchema);
    if (form.valid) {
      const criador_id = locals.sessao.uid
      const res = alterarUsuario({ criador_id, ...form.data })
      if (res.ok) { return message(form, res.message) }
      const camposMsg = res.fieldMessage ?? {}
      for (const campo in camposMsg) {
        const campoMsg = camposMsg[campo];
        setError(form, campo, campoMsg)
      }
      return message(form, res.message)
    }
    return message(form, 'Erro no preenchimento dos campos')
  },

  apagar: async ({ request, locals }) => {
    const form = await superValidate(request, deleteIdSchema);
    console.log(form)
    if (form.valid) {
      const res = alterarStatusUsuarioDB({ uid: locals.sessao.uid, id: form.data.id })
      if (res.ok) { return message(form, res.message) }
      //* Erro no banco
      return message(form, res.message, { status: 500 })
    }
    return message(form, 'Usuário inválido', { status: 400 })
  },
  alternarStatus: async ({ request, locals }) => {
    const form = await superValidate(request, deleteIdSchema);
    console.log(form)
    if (form.valid) {
      const res = alterarStatusUsuarioDB({ uid: locals.sessao.uid, id: form.data.id })
      if (res.ok) { return message(form, res.message) }
      //* Erro no banco
      return message(form, res.message, { status: 500 })
    }
    return message(form, 'Usuário inválido', { status: 400 })
  }
}