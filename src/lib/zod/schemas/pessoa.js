import { PESSOA_FISICA, REP_CLIENTE } from "$lib/globals"
import { z, zCEP, zCNPJ, zCPF, zDate, zEmail, zID, zOptional, zRG } from "$lib/zod"

export const pessoaSchema = z.object({
  id: zID,
  empresa_id: zID,
  criador_id: zID,
  tipo_pessoa: zID,
  rep: zID,
  nome: z.string().trim().min(5),
  email: zOptional(zEmail),
  cpf: zOptional(zCPF),
  cnpj: zOptional(zCNPJ),
  rg: zOptional(zRG),
  apelido: zOptional(z.string().trim().min(1)),
  endereco: zOptional(z.string().trim().min(5)),
  cep: zOptional(zCEP),
  sexo: zID,
  dn: zOptional(zDate),
})

export const criarPessoaSchema = pessoaSchema.omit({ id: true, empresa_id: true, criador_id: true })

export const editarPessoaSchema = pessoaSchema.omit({ empresa_id: true, criador_id: true })

//TODO criar função de validação de ENUMS:  tipo_pessoa, rep e sexo