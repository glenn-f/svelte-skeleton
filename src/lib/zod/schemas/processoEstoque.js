import { FCC_CUSTO, FCC_RECEITA } from "$lib/globals"
import { roundBy } from "$lib/helpers"
import { z, zID, zOptional, zTString } from "$lib/zod"
import { criarEntradaTransacoesSchema } from "./contaFormas"
import { criarEntradaContabilSchema } from "./contabil"
import { criarEntradaEstoqueSchema } from "./estoque"

export const criarEntradaSchema = z.object({
  estoque: z.array(criarEntradaEstoqueSchema).min(1).default([]),
  transacoes: z.array(criarEntradaTransacoesSchema).default([]),
  contabil: z.array(criarEntradaContabilSchema).default([]),
  responsavel_id: zOptional(zID),
  participante_id: zOptional(zID),
  observacoes: zOptional(zTString),
}).refine(({ estoque, transacoes, contabil }) => {
  const totalContabil = roundBy(contabil.reduce((acc, { valor, classe_fc }) => acc + (valor * (classe_fc == FCC_RECEITA ? -1 : 1)), 0), 2)
  const totalEstoque = roundBy(estoque.reduce((acc, { custo }) => acc + custo, 0), 2)
  const totalTransacoes = roundBy(transacoes.reduce((acc, { valor }) => acc + valor, 0), 2)
  return (totalEstoque + totalContabil) === totalTransacoes
}, { message: 'Total Final deve ser igual a 0,00' })

/**
 * @typedef {typeof criarEntradaSchema._type} CriarEntrada
 */
