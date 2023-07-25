import { redirect } from '@sveltejs/kit'
import { apagarSessaoUsuario } from '$lib/server/loginSessao';

export async function GET({ locals, cookies }) {
    if (locals.sessao) {
        cookies.delete('sid', { path: '/' })
        apagarSessaoUsuario(locals.sessao.sid)
    }
    throw redirect(302, "/login");
};