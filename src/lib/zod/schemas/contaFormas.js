import { z, zCurrency, zID, zMoeda, zOptional, zTString } from "$lib/zod"

export const contaFormaSchema = z.object({
  id: zID,
  criador_id: zID,
  conta_id: zID,
  nome: z.string().trim().min(3),
  pode_parcelar: z.coerce.boolean(),
  pode_receber: z.coerce.boolean(),
  pode_pagar: z.coerce.boolean(),
})

export const formaTransacaoSchema = z.object({
  id: zID,
  criador_id: zID,
  conta_forma_id: zID,
  parcela: z.number().int().min(0),
  taxa_encargo: z.number().min(0),
})

export const addPgtoEntradaSchema = z.object({
  forma_transacao_id: zID,
  valor: zCurrency
})

export const addRcbtoSaidaSchema = z.object({
  forma_transacao_id: zID,
  valor: zMoeda,
  observacoes: zOptional(zTString),
})
export const criarSaidaTransacoesSchema = addRcbtoSaidaSchema

export const criarEntradaTransacoesSchema = addPgtoEntradaSchema

export const criarContaFormaSchema = z.object({
  conta_id: contaFormaSchema.shape.conta_id,
  nome: contaFormaSchema.shape.nome,
  pode_pagar: contaFormaSchema.shape.pode_pagar,
  pode_receber: contaFormaSchema.shape.pode_receber,
  pode_parcelar: contaFormaSchema.shape.pode_parcelar,
  parcelamentos: z.array(formaTransacaoSchema.pick({ parcela: true, taxa_encargo: true })).nullish(),
  taxa_encargo: formaTransacaoSchema.shape.taxa_encargo.nullish(),
}).refine(data => !(data.pode_parcelar && !(data.parcelamentos?.length > 0)), { message: "Deve conter pelo menos um parcelamento", path: ["parcelamentos"] })
  .refine(data => !(!data.pode_parcelar && !Number.isFinite(data.taxa_encargo)), { message: "Campo obrigatório", path: ["taxa_encargo"] })
  .transform(data => {
    const { taxa_encargo, parcelamentos, ...campos } = data
    if (data.pode_parcelar) {
      return { parcelamentos, ...campos }
    } else {
      return { taxa_encargo, ...campos }
    }
  })

export const editarContaFormaSchema = contaFormaSchema.pick({ id: true, conta_id: true, nome: true, pode_pagar: true, pode_parcelar: true, pode_receber: true }).extend({
  parcelamentos: z.array(formaTransacaoSchema.pick({ parcela: true, taxa_encargo: true })).nullish(),
  taxa_encargo: formaTransacaoSchema.shape.taxa_encargo.nullish(),
}).refine(data => !(data.pode_parcelar && !(data.parcelamentos?.length > 0)), { message: "Deve conter pelo menos um parcelamento", path: ["parcelamentos"] })
  .refine(data => !(!data.pode_parcelar && !Number.isFinite(data.taxa_encargo)), { message: "Campo obrigatório", path: ["taxa_encargo"] })
  .transform(data => {
    const { taxa_encargo, parcelamentos, ...campos } = data
    if (data.pode_parcelar) {
      return { parcelamentos, ...campos }
    } else {
      return { taxa_encargo, ...campos }
    }
  })