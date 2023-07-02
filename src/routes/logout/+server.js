import { redirect } from '@sveltejs/kit'
import { apagarSessao } from '$lib/server/session'

export async function GET({ locals, cookies }) {
    if (locals.sessao) {
        cookies.delete('sid', { path: '/' })
        apagarSessao(locals.sessao.sid)
    }
    throw redirect(302, "/login");
};