import { z, zID, zOptional, zTString } from "$lib/zod"

export const produtoSchema = z.object({
  id: zID,
  empresa_id: zID,
  produto_categoria_id: zOptional(zID),
  nome: z.string().trim().min(4),
  titulo_codigo: zOptional(zTString),
  config_json: zOptional(zTString),
})

export const criarProdutoSchema = produtoSchema.pick({ produto_categoria_id: true, nome: true, titulo_codigo: true })

export const editarProdutoSchema = produtoSchema.pick({ id: true, produto_categoria_id: true, nome: true, titulo_codigo: true })