import { z, zID, zTString } from "$lib/zod"

export const gpeSchema = z.object({
  id: zID,
  empresa_id: zID,
  criador_id: zID,
  nome: zTString.min(3),
  pode_iniciar_venda: z.boolean().default(0),
  pode_ver_estoque_disponivel: z.boolean().default(0),
  pode_ver_historico_vendas: z.boolean().default(0),
  pode_ver_estoque: z.boolean().default(0),
  pode_entrada_estoque: z.boolean().default(0),
  pode_saida_estoque: z.boolean().default(0),
  pode_ver_saldo: z.boolean().default(0),
  pode_transacao_receita: z.boolean().default(0),
  pode_transacao_despesa: z.boolean().default(0),
  pode_cadastrar_produto: z.boolean().default(0),
  pode_cadastrar_pessoa: z.boolean().default(0),
  pode_cadastrar_conta: z.boolean().default(0),
  pode_cadastrar_usuario: z.boolean().default(0)
})

export const criarGPESchema = gpeSchema.omit({ id: true, empresa_id: true, criador_id: true })

export const editarGPESchema = gpeSchema.omit({ empresa_id: true, criador_id: true })