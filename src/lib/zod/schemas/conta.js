import { z, zID } from "$lib/zod"

export const contaSchema = z.object({
  id: zID,
  empresa_id: zID,
  criador_id: zID,
  nome: z.string().trim().min(3),
})

export const criarContaSchema = contaSchema.omit({ id: true, empresa_id: true, criador_id: true })

export const editarContaSchema = contaSchema.omit({ empresa_id: true, criador_id: true })
