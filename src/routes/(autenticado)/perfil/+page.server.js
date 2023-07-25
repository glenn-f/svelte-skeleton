import { db } from '$lib/server/db';
import { encriptarSenha } from '$lib/server/encript.js';
import { resetarSessoesUsuario, sessionCookieSettings } from '$lib/server/loginSessao';
import { alterarSenhaPerfilUsuarioSchema, editarPerfilUsuarioSchema } from '$lib/zod/schemas/usuario';
import { error } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';

export async function load({ locals }) {
    const id = locals.sessao.uid

    const query = db.prepare('SELECT nome, email FROM usuario WHERE id = $id')
    const usuario = query.get({ id })

    if (!usuario) throw error(401)
    const { nome, email } = usuario

    const formEditar = await superValidate({ nome, email }, editarPerfilUsuarioSchema)
    const formAlterarSenha = await superValidate(alterarSenhaPerfilUsuarioSchema)

    return { formEditar, formAlterarSenha };
};

export const actions = {
    editar: async ({ request, locals, cookies }) => {
        const formEditar = await superValidate(request, editarPerfilUsuarioSchema)
        if (formEditar.valid) {
            const id = locals.sessao.uid
            const { email, nome } = formEditar.data

            //* Atualização dos dados no Banco de Dados
            const query = db.prepare("UPDATE usuario SET email = $email , nome = $nome WHERE id = $id")
            const result = query.run({ id, email, nome })

            if (result.changes > 0) {
                //* Atualizar sessão
                const sessao = resetarSessoesUsuario(id)
                if (sessao.valid) {
                    cookies.set('sid', sessao.data.sid, { ...sessionCookieSettings, maxAge: sessao.data.expiracao / 1000 })
                }

                //* OK
                return message(formEditar, "Seus dados foram atualizados com sucesso.")
            } else {
                //* Erro no servidor
                return message(formEditar, "Os dados não foram alterados.", { status: 500 })
            }
        }
        //* Bad Request
        return message(formEditar, "Erro no preenchimento dos campos.", { status: 400 })
    },
    alterarSenha: async ({ request, locals, cookies }) => {
        const formAlterarSenha = await superValidate(request, alterarSenhaPerfilUsuarioSchema)
        if (formAlterarSenha.valid) {
            const id = locals.sessao.uid
            let { senha } = formAlterarSenha.data
            senha = encriptarSenha(senha)

            //* Atualização da senha no Banco de Dados
            const query = db.prepare("UPDATE usuario SET senha = $senha WHERE id = $id")
            const result = query.run({ id, senha })

            //TODO Apagar sessões deste usuário e criar nova sessão para esta request

            if (result.changes > 0) {
                //* Atualizar sessão
                const sessao = resetarSessoesUsuario(id)
                if (sessao.valid) {
                    cookies.set('sid', sessao.data.sid, { ...sessionCookieSettings, maxAge: sessao.data.expiracao / 1000 })
                }

                //* Ok
                return message(formAlterarSenha, 'Sua senha foi alterada com sucesso.')
            } else {
                //* Server Error
                return message(formAlterarSenha, "A senha não foi alterada.", { status: 500 })
            }
        }
        //* Bad Request
        return message(formAlterarSenha, "Erro no preenchimento dos campos.", { status: 400 })
    }
}