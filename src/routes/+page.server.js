import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
    if (locals.sessao) { throw redirect(302, "/inicio") }
    else { throw redirect(302, "/login") }
}