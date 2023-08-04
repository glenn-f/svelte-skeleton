import { z, zCurrency, zID, zOptional, zTString } from "..";

export const addLancamentoEntradaSchema = z.object({
  classe_fc: zID,
  tipo_fc: zID,
  valor: zCurrency,
  observacoes: zOptional(zTString)
})

export const criarEntradaContabilSchema = addLancamentoEntradaSchema