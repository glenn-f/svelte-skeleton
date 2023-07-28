import { alterarSenhaUsuario, detalharUsuario, editarUsuario } from '$lib/server/db/models/usuario.js';
import { resetarSessoesUsuario, sessionCookieSettings } from '$lib/server/loginSessao';
import { alterarSenhaPerfilUsuarioSchema, editarPerfilUsuarioSchema } from '$lib/zod/schemas/usuario';
import { message, superValidate } from 'sveltekit-superforms/server';

export async function load({ locals }) {
    const id = locals.sessao.uid
    const usuario = detalharUsuario({ id })
    const formEditar = await superValidate(usuario, editarPerfilUsuarioSchema)
    const formAlterarSenha = await superValidate(alterarSenhaPerfilUsuarioSchema)

    return { formEditar, formAlterarSenha };
};

export const actions = {
    editar: async ({ request, locals, cookies }) => {
        //* Validar dados recebidos
        const form = await superValidate(request, editarPerfilUsuarioSchema)
        if (!form.valid) return message(form, "Erro no preenchimento dos campos", { status: 400 })

        //* Atualizar banco de dados
        const id = locals.sessao.uid
        const { email, nome } = form.data
        const resUsuario = editarUsuario({ id, nome, email })
        if (!resUsuario.valid) return message(form, "Os dados não foram alterados", { status: 500 })
        //TODO tratar erro de banco: email viola restrição de UNIQUE

        //* Atualizar sessão
        const resSessao = resetarSessoesUsuario(id)
        if (!resSessao.valid) return message(form, "A sessão não foi resetada", { status: 500 })

        //* Atualizar cookies e enviar resposta
        const { sid, expiracao } = resSessao.data
        cookies.set('sid', sid, { ...sessionCookieSettings, maxAge: expiracao / 1000 })
        return message(form, "Dados atualizados com sucesso")
    },
    alterarSenha: async ({ request, locals, cookies }) => {
        //* Validar dados recebidos
        const form = await superValidate(request, alterarSenhaPerfilUsuarioSchema)
        if (!form.valid) return message(form, "Erro no preenchimento dos campos", { status: 400 })

        //* Atualizar banco de dados
        const id = locals.sessao.uid
        const senha = form.data.senha
        const resUsuario = alterarSenhaUsuario({ id, senha })
        if (!resUsuario.valid) return message(form, "A senha não foi alterada", { status: 500 })

        //* Atualizar sessão
        const resSessao = resetarSessoesUsuario(id)
        if (!resSessao.valid) return message(form, "A sessão não foi resetada", { status: 500 })

        //* Atualizar cookies e enviar resposta
        const { sid, expiracao } = resSessao.data
        cookies.set('sid', sid, { ...sessionCookieSettings, maxAge: expiracao / 1000 })
        return message(form, "Senha alterada com sucesso")
    }
}
