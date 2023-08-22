import { z, zCurrency, zID, zMoeda, zOptional, zTString } from "$lib/zod"

export const comissaoSchema = z.object({
  id: zID,
  empresa_id: zID,
  criador_id: zID,
  nome: z.string().trim().min(3),
  descricao: zOptional(zTString),
  bonus_fixo: zCurrency,
  taxa_fixa: zCurrency,
})

export const criarComissaoSchema = comissaoSchema.omit({ id: true, empresa_id: true, criador_id: true })

export const editarComissaoSchema = comissaoSchema.omit({ empresa_id: true, criador_id: true })
