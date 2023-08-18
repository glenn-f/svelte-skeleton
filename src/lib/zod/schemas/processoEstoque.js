import { PE_PERDA, PE_VENDA, PE_VENDA_COM_BUYBACK, isReceita } from "$lib/globals"
import { roundBy } from "$lib/helpers"
import { z, zID, zOptional, zTString } from "$lib/zod"
import { criarEntradaTransacoesSchema, criarSaidaTransacoesSchema } from "./contaFormas"
import { criarContabilSchema } from "./contabil"
import { criarEntradaEstoqueSchema, criarSaidaBuybackSchema, criarSaidaEstoqueSchema } from "./estoque"

export const criarEntradaSchema = z.object({
  estoque: z.array(criarEntradaEstoqueSchema).min(1).default([]),
  transacoes: z.array(criarEntradaTransacoesSchema).default([]),
  contabil: z.array(criarContabilSchema).default([]),
  responsavel_id: zOptional(zID),
  participante_id: zOptional(zID),
  observacoes: zOptional(zTString),
}).refine(({ estoque, transacoes, contabil }) => {
  const totalContabil = roundBy(contabil.reduce((acc, { valor }) => acc + valor, 0), 2)
  const totalEstoque = roundBy(estoque.reduce((acc, { custo }) => acc + custo, 0), 2)
  const totalTransacoes = roundBy(transacoes.reduce((acc, { valor }) => acc + valor, 0), 2)
  return roundBy(totalEstoque - totalContabil, 2) === roundBy(totalTransacoes, 2)
}, { message: 'O total a pagar deve ser igual ao total pago' })

export const criarSaidaSchema = z.object({
  tipo_pe: zID.default(PE_VENDA),
  estoque_saida: z.array(criarSaidaEstoqueSchema).min(1).default([]),
  buyback: z.array(criarSaidaBuybackSchema).default([]),
  transacoes: z.array(criarSaidaTransacoesSchema).default([]),
  contabil: z.array(criarContabilSchema).default([]),
  responsavel_id: zOptional(zID),
  participante_id: zOptional(zID),
  observacoes: zOptional(zTString),
}).refine(({ tipo_pe, estoque_saida, transacoes, contabil, buyback }) => {
  if (tipo_pe === PE_PERDA) return true
  const totalVendas = roundBy(estoque_saida.reduce((acc, { valor }) => acc + valor, 0), 2)
  const totalLancamentos = roundBy(contabil.reduce((acc, { valor, tipo_fc }) => acc + (isReceita(tipo_fc) ? valor : 0), 0), 2)
  const totalTransacoes = roundBy(transacoes.reduce((acc, { valor }) => acc + valor, 0), 2)
  const totalBuyback = tipo_pe === PE_VENDA_COM_BUYBACK ? roundBy(buyback.reduce((acc, { custo }) => acc + custo, 0), 2) : 0
  return roundBy(totalVendas + totalLancamentos, 2) === roundBy(totalTransacoes + totalBuyback, 2)
}, { message: 'O total a receber deve ser igual ao total recebido' })
  .transform((d) => {
    if (d.tipo_pe === PE_VENDA) {
      d.buyback = []
    } else if (d.tipo_pe === PE_PERDA) {
      d.buyback = []
      d.contabil = []
      d.transacoes = []
      d.estoque_saida = d.estoque_saida.map((v) => { v.valor = 0; return v; })
    }
    return d
  })

/**
 * @typedef {typeof criarEntradaSchema._type} CriarEntrada
 */

/**
 * @typedef {typeof criarSaidaSchema._type} CriarSaida
 */
