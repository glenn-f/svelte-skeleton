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
  regra_comissao_id: zOptional(zID),
  regra_tributo_id: zOptional(zID),
})

export const criarEntradaEstoqueSchema = estoqueEsquema.pick({ regra_comissao_id: true, regra_tributo_id: true, produto_id: true, custo: true, preco_unitario: true, estado: true, condicao: true, origem: true, codigo: true, observacoes: true }).extend({
  qntd: zInt.min(1),
})

export const criarSaidaBuybackSchema = estoqueEsquema.pick({ produto_id: true, condicao: true, origem: true, codigo: true, observacoes: true }).extend({
  qntd: zInt.min(1),
  custo: zCurrency,
})

export const addBuybackSaidaSchema = estoqueEsquema.pick({ produto_id: true, condicao: true, origem: true, codigo: true, observacoes: true }).extend({
  qntd: zInt.min(1),
  custo_unitario: zCurrency,
}).transform(({ custo_unitario, qntd, ...dados }) => ({ custo: custo_unitario * qntd, qntd, ...dados }))

export const addItemEntradaSchema = estoqueEsquema.pick({ regra_comissao_id: true, regra_tributo_id: true, produto_id: true, preco_unitario: true, estado: true, condicao: true, origem: true, codigo: true, observacoes: true }).extend({
  qntd: zInt.min(1),
  custo_unitario: zCurrency
}).refine(({ preco_unitario, estado }) => !(estado == EE_DISPONIVEL && !Number.isFinite(preco_unitario)), { message: "Campo obrigatório", path: ['preco_unitario'] })
  .transform(({ custo_unitario, qntd, ...dados }) => ({ custo: custo_unitario * qntd, qntd, ...dados }))

export const addItemSaidaSchema = z.object({
  tipo_fe: z.number({ invalid_type_error: "Campo obrigatório" }).int("Escolha uma opção"),
  estoque: z.any(),
  id: zID,
  qntd: zInt.min(1),
  valor: zCurrency,
  observacoes: zOptional(zTString),
  responsavel_id: zOptional(zID),
}).refine(({ qntd, estoque }) => estoque?.qntd >= qntd, { message: "Quantidade indisponível", path: ['qntd'] })
  .transform(({ estoque, ...d }) => d)

export const criarSaidaEstoqueSchema = z.object({
  tipo_fe: zID,
  id: zID,
  qntd: zInt.min(1),
  valor: zCurrency,
  observacoes: zOptional(zTString),
  responsavel_id: zOptional(zID),
})

export const editarInventarioSchema = estoqueEsquema.pick({ observacoes: true, regra_comissao_id: true, regra_tributo_id: true, preco_unitario: true, estado: true })
  .refine(({ preco_unitario, estado }) => !(estado == EE_DISPONIVEL && !Number.isFinite(preco_unitario)), { message: "Campo obrigatório", path: ['preco_unitario'] })
  .transform(({ observacoes, regra_comissao_id, regra_tributo_id, estado, preco_unitario }) => {
    regra_comissao_id = regra_comissao_id ?? null
    regra_tributo_id = regra_tributo_id ?? null
    observacoes = observacoes ?? null
    return { observacoes, regra_comissao_id, regra_tributo_id, estado, preco_unitario }
  })

/** @typedef {typeof editarInventarioSchema._type} EditarItemInventario */