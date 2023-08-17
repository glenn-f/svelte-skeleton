import { z, zContabil, zCurrency, zID, zMoeda, zOptional, zTString } from "..";

export const addLancamentoEntradaSchema = z.object({
  classe_fc: zID,
  tipo_fc: zID,
  valor: zCurrency,
  observacoes: zOptional(zTString)
})

export const addLancamentoSaidaSchema = z.object({
  valor: zMoeda,
  observacoes: zOptional(zTString),
})

export const criarSaidaContabilSchema = z.object({
  tipo_fc: zID,
  valor: zContabil,
  observacoes: zOptional(zTString),
})
export const criarEntradaContabilSchema = addLancamentoEntradaSchema