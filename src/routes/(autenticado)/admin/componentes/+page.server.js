import { superValidate } from 'sveltekit-superforms/server';
import { z, zDate } from '$lib/zod';

const schema = z.object({
    perc: z.any(),
    moeda: z.any(),
    dn: z.any(),
    formText: z.string().default('testee')
})

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    let dn = new Date().getTime()
    const form = superValidate({ dn }, schema, { errors: false })
    return { form };
};

/** @type {import("./$types").Actions} */
export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        console.log(data)
    }
}