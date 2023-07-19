import { z, zID } from "$lib/zod"

export const categoriaSchema = z.object({
  id: zID,
  empresa_id: zID,
  nome: z.string().trim().min(4),
})

export const criarCategoriaSchema = categoriaSchema.pick({ nome: true })

export const editarCategoriaSchema = categoriaSchema.pick({ id: true, nome: true })