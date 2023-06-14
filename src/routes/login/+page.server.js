import { superValidate } from 'sveltekit-superforms/server'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  senha: z.string()
})

/** @type {import("./$types").PageServerLoad} */
export async function load() {
  const form = await superValidate(schema)
  return { form }
}

/** @type {import("./$types").Actions} */
export const actions = {
  async login({ request, cookies }) {
    const form = await superValidate(request, schema)
    console.log('POST', form)

    return { form }
  }
}
