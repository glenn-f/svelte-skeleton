import { superValidate } from 'sveltekit-superforms/server';
import { z } from '../../../../lib/zodBr';

const schema = z.object({
    perc: z.any(),
    moeda: z.any(),
    dn: z.coerce.date()
})

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    const form = superValidate(schema)
    return { form };
};

/** @type {import("./$types").Actions} */
export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        console.log(data)
    }
}