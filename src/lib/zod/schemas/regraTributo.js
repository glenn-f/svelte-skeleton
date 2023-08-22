import { z, zCurrency, zID, zMoeda, zOptional, zTString } from "$lib/zod"

export const tributoSchema = z.object({
  id: zID,
  empresa_id: zID,
  criador_id: zID,
  nome: z.string().trim().min(3),
  descricao: zOptional(zTString),
  taxa_fixa: zCurrency,
})

export const criarTributoSchema = tributoSchema.omit({ id: true, empresa_id: true, criador_id: true })

export const editarTributoSchema = tributoSchema.omit({ empresa_id: true, criador_id: true })
