import { z, zCEP, zCNPJ, zID, zOptional, zTelBR, zTString } from "$lib/zod"

export const empresaSchema = z.object({
  id: zID,
  dono_id: zID,
  nome_fantasia: zTString.min(3),
  razao_social: zOptional(zTString.min(3)),
  cnpj: zOptional(zCNPJ),
  inscricao_estadual: zOptional(zTString),
  codigo_regime_tributario: zOptional(zTString),
  pais: zOptional(zTString),
  uf: zOptional(zTString),
  municipio: zOptional(zTString),
  bairro: zOptional(zTString),
  cep: zOptional(zCEP),
  endereco: zOptional(zTString),
  telefone: zOptional(zTelBR),
})

export const criarEmpresaSchema = empresaSchema.omit({ id: true, dono_id: true })

export const editarEmpresaSchema = empresaSchema.omit({ dono_id: true })