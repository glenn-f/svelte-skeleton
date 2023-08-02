import { EE_DISPONIVEL } from "$lib/globals"
import { z, zCurrency, zID, zInt, zOptional, zTString } from "$lib/zod"

const estoqueEsquema = z.object({
  id: zID,
  produto_id: zID,
  qntd: zInt.min(0),
  custo: zCurrency,
  preco_unitario: zOptional(zCurrency),
  estado: zID,
  condicao: zID,
  origem: zID,
  codigo: zOptional(zTString),
  observacoes: zOptional(zTString),
  dados_json: zOptional(zTString),
  criador_id: zOptional(zID),
})

export const criarEntradaEstoqueSchema = estoqueEsquema.pick({ produto_id: true, custo: true, preco_unitario: true, estado: true, condicao: true, origem: true, codigo: true, observacoes: true }).extend({
  qntd: zInt.min(1)
})

export const addItemEntradaSchema = estoqueEsquema.pick({ produto_id: true, preco_unitario: true, estado: true, condicao: true, origem: true, codigo: true, observacoes: true }).extend({
  qntd: zInt.min(1),
  custo_unitario: zCurrency
}).refine(({ preco_unitario, estado }) => !(estado == EE_DISPONIVEL && !Number.isFinite(preco_unitario)), { message: "Campo obrigatório", path: ['preco_unitario'] })
  .transform(({ custo_unitario, qntd, ...dados }) => ({ custo: custo_unitario * qntd, qntd, ...dados }))