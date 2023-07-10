import { PESSOA_FISICA, PESSOA_JURIDICA, REP_CLIENTE, REP_COLABORADOR, REP_FORNECEDOR, SEXO_FEMININO, SEXO_MASCULINO } from "$lib/globals"
import { z, zCEP, zCNPJ, zCPF, zDate, zEmail, zID, zNumericEnum, zOptional, zRG } from "$lib/zod"

export const pessoaSchema = z.object({
  id: zID,
  empresa_id: zID,
  criador_id: zID,
  tipo_pessoa: zNumericEnum([PESSOA_FISICA, PESSOA_JURIDICA]),
  rep: zNumericEnum([REP_CLIENTE, REP_COLABORADOR, REP_FORNECEDOR]),
  nome: z.string().trim().min(5),
  email: zOptional(zEmail),
  cpf: zOptional(zCPF),
  cnpj: zOptional(zCNPJ),
  rg: zOptional(zRG),
  apelido: zOptional(z.string().trim().min(1)),
  endereco: zOptional(z.string().trim().min(5)),
  cep: zOptional(zCEP),
  sexo: zOptional(zNumericEnum([SEXO_MASCULINO, SEXO_FEMININO])),
  dn: zOptional(zDate),
})

export const criarPessoaSchema = pessoaSchema.omit({ id: true, empresa_id: true, criador_id: true }).extend({
  tipo_pessoa: pessoaSchema.shape.tipo_pessoa.default(PESSOA_FISICA),
  rep: pessoaSchema.shape.rep.default(REP_CLIENTE),
})

export const editarPessoaSchema = pessoaSchema.omit({ empresa_id: true, criador_id: true })