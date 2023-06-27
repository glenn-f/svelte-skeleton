/** @type {import('./$types').PageServerLoad} */
export async function load() {
    return {};
};

/** @type {import("./$types").Actions} */
export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        console.log(data)
    }
}