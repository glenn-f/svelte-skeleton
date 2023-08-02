import { roundBy } from "$lib/helpers"
import { z, zID, zOptional, zTString } from "$lib/zod"
import { criarEntradaTransacoesSchema } from "./contaFormas"
import { criarEntradaEstoqueSchema } from "./estoque"

export const criarEntradaSchema = z.object({
  estoque: z.array(criarEntradaEstoqueSchema).min(1).default([]),
  transacoes: z.array(criarEntradaTransacoesSchema).default([]),
  responsavel_id: zOptional(zID),
  participante_id: zOptional(zID),
  observacoes: zOptional(zTString),
}).refine(({ estoque, transacoes }) => {
  const totalEstoque = roundBy(estoque.reduce((acc, { custo }) => acc + custo, 0), 2)
  const totalTransacoes = roundBy(transacoes.reduce((acc, { valor }) => acc + valor, 0), 2)
  return totalEstoque === totalTransacoes
}, { message: 'O custo total deve ser igual ao pagamento total' })

/**
 * @typedef {typeof criarEntradaSchema._type} CriarEntrada
 */
