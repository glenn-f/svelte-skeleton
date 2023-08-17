import { FCC_CUSTO, FCC_RECEITA, PE_PERDA, PE_VENDA, PE_VENDA_COM_BUYBACK, isReceita } from "$lib/globals"
import { roundBy } from "$lib/helpers"
import { z, zID, zOptional, zTString } from "$lib/zod"
import { criarEntradaTransacoesSchema, criarSaidaTransacoesSchema } from "./contaFormas"
import { criarEntradaContabilSchema, criarSaidaContabilSchema } from "./contabil"
import { criarEntradaEstoqueSchema, criarSaidaBuybackSchema, criarSaidaEstoqueSchema } from "./estoque"

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

export const criarSaidaSchema = z.object({
  tipo_pe: zID.default(PE_VENDA),
  estoque_saida: z.array(criarSaidaEstoqueSchema).min(1).default([]),
  buyback: z.array(criarSaidaBuybackSchema).default([]),
  transacoes: z.array(criarSaidaTransacoesSchema).default([]),
  contabil: z.array(criarSaidaContabilSchema).default([]),
  responsavel_id: zOptional(zID),
  participante_id: zOptional(zID),
  observacoes: zOptional(zTString),
}).refine(({ tipo_pe, estoque_saida, transacoes, contabil, buyback }) => {
  if (tipo_pe === PE_PERDA) return true
  const totalVendas = roundBy(estoque_saida.reduce((acc, { valor }) => acc + valor, 0), 2)
  const totalLancamentos = roundBy(contabil.reduce((acc, { valor, tipo_fc }) => acc + (isReceita(tipo_fc) ? valor : 0), 0), 2)
  const totalTransacoes = roundBy(transacoes.reduce((acc, { valor }) => acc + valor, 0), 2)
  const totalBuyback = tipo_pe === PE_VENDA_COM_BUYBACK ? roundBy(buyback.reduce((acc, { custo }) => acc + custo, 0), 2) : 0
  return (totalVendas + totalLancamentos) === (totalTransacoes + totalBuyback)
}, { message: 'O total a receber deve ser igual ao total recebido' })

/**
 * @typedef {typeof criarEntradaSchema._type} CriarEntrada
 */

/**
 * @typedef {typeof criarSaidaSchema._type} CriarSaida
 */
