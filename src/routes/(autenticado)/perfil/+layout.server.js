/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals }) {
    return { perm: locals.sessao.perm };
}