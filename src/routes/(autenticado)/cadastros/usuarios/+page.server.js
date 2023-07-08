import { db } from '$lib/server/db';
import { idSchema } from '$lib/zod';
import { addUsuarioEmpresaSchema, editUsuarioEmpresaSchema } from '$lib/zod/schemas/usuario';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { alterarUsuarioEmpresa, criarUsuarioEmpresa, toggleStatusUsuarioEmpresa } from '$lib/server/db';

export async function load({ locals }) {
  const form = await superValidate(addUsuarioEmpresaSchema)
  const { empresa_id: eid } = locals.sessao

  //* Pegar usuários desta empresa
  const query = db.prepare('SELECT ue.gpe_id, ue.criacao associacao, ue.delecao desativacao, u.id, u.nome, u.email, u.perm_usuario, u.criador_id, c.nome criador_nome FROM usuario u JOIN usuario_empresa ue ON ue.usuario_id = u.id left join usuario c on c.id = u.criador_id WHERE ue.empresa_id = $eid')
  const usuarios = query.all({ eid })

  const queryGPE = db.prepare('SELECT * FROM grupo_permissao_empresa WHERE empresa_id = $eid AND delecao IS NULL')
  const gpes = queryGPE.all({ eid })
  return { usuarios, form, permOptions: gpes };
};



export const actions = {
  adicionar: async ({ request, locals }) => {
    const form = await superValidate(request, addUsuarioEmpresaSchema);
    if (form.valid) {
      const criador_id = locals.sessao.uid
      const empresa_id = locals.sessao.empresa_id
      const { nome, email, senha, gpe_id } = form.data
      const res = criarUsuarioEmpresa({ nome, email, senha, gpe_id, criador_id, empresa_id })
      if (res.ok) { return message(form, "Usuário criado com sucesso") }
      if (res.errors) {
        for (let [field, text] of Object.entries(res.errors)) setError(form, field, text)
        return message(form, 'Houve problemas em alguns campos', { status: 400 })
      }
      return message(form, 'Erro no servidor. Não foi possível criar o usuário', { status: 500 })
    }
    return message(form, 'Erro no preenchimento dos campos')
  },

  editar: async ({ request, locals }) => {
    const form = await superValidate(request, editUsuarioEmpresaSchema);
    if (form.valid) {
      const { id, nome, email, senha, gpe_id } = form.data
      const eid = locals.sessao.empresa_id
      console.log({ id, nome, email, senha, gpe_id })
      const res = alterarUsuarioEmpresa({ id, nome, email, senha, gpe_id, eid })
      if (res.ok) { return message(form, "Usuário alterado com sucesso") }
      if (res.errors) {
        for (let [field, text] of Object.entries(res.errors)) setError(form, field, text)
        return message(form, 'Houve problemas em alguns campos', { status: 400 })
      }
      return message(form, 'Erro no servidor. Não foi possível alterar o usuário', { status: 500 })
    }
    return message(form, 'Erro no preenchimento dos campos')
  },

  alternarStatus: async ({ request, locals }) => {
    const form = await superValidate(request, idSchema);
    if (form.valid) {
      const uid = form.data.id
      const eid = locals.sessao.empresa_id
      const res = toggleStatusUsuarioEmpresa({ uid, eid })
      if (res.ok) { return message(form, res.message) }
      if (res.errors) {
        for (let [field, text] of Object.entries(res.errors)) setError(form, field, text)
        return message(form, 'Houve problemas em alguns campos', { status: 400 })
      }
      return message(form, 'Erro no servidor. Não foi possível alterar o usuário', { status: 500 })
    }
    return message(form, 'Erro no preenchimento dos campos')
  }
}