import { redirect } from '@sveltejs/kit'
import { apagarSessao } from '../../lib/server/session.js'

export async function GET({ locals }) {
    if (locals.sessao) { apagarSessao(locals.sessao.sid) }
    throw redirect(302, "/login");
};