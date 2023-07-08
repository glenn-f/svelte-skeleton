import { z } from "$lib/zod"

export const empresaSchema = z.object({
  id: z.coerce.number(),
  dono_id: z.coerce.number(),
  nome_fantasia: z.string().min(6),
  razao_social: z.string().optional().default(""),
  cnpj: z.string().optional().default(""),
  inscricao_estadual: z.string().optional().default(""),
  codigo_regime_tributario: z.string().optional().default(""),
  pais: z.string().optional().default(""),
  uf: z.string().optional().default(""),
  municipio: z.string().optional().default(""),
  bairro: z.string().optional().default(""),
  cep: z.string().optional().default(""),
  endereco: z.string().optional().default(""),
  telefone: z.string().optional().default(""),
})

export const criarEmpresaSchema = empresaSchema.omit({ id: true, dono_id: true })

export const editarEmpresaSchema = empresaSchema.omit({ dono_id: true })