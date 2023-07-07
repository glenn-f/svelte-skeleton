import { PESSOA_FISICA, PESSOA_JURIDICA, RELACIONAMENTO_CLIENTE, RELACIONAMENTO_COLABORADOR, RELACIONAMENTO_FORNECEDOR, SEXO_FEMININO, SEXO_MASCULINO } from "./globals";
import { z } from "./zodBr";
// import { z } from "zod";

function deleteUndefined(obj) {
  for (const key in obj)
    if (obj[key] === undefined)
      delete obj[key]
  return obj;
}

function stringUndefined(schema) {
  return z.preprocess(text => text === '' ? undefined : text, schema)
}

//* Esquemas genéricos
export const deleteIdSchema = z.object({
  id: z.coerce.number().int()
})

export const zOptionalInput = z.literal('').nullish()
export const zDate = z.union([z.number(), z.string().trim().min(1), z.date()]).pipe(z.coerce.date())
export const zNumberEnum = (list) => z.coerce.number().pipe(z.enum(list))
export const zCEP = z.string().trim().regex(/^\d{8}$/, "CEP Inválido")
export const zCPF = z.string().trim().regex(/^\d{11}$/)
export const zCNPJ = z.string().trim().regex(/^\d{14}$/)
export const zTelBR = z.string().trim().regex(/^\d{10,11}$/)
export const zNumber = z.coerce.number()
export const zCurrency = z.coerce.number().nonnegative()

//* Esquemas de Pessoa
export const pessoaSchema = z.object({
  id: z.coerce.number().int(),
  empresa_id: z.coerce.number().int(),
  criador_id: z.coerce.number().int(),
  tipo_pessoa: zNumberEnum([PESSOA_FISICA, PESSOA_JURIDICA]),
  tipo_relacionamento: zNumberEnum([RELACIONAMENTO_CLIENTE, RELACIONAMENTO_COLABORADOR, RELACIONAMENTO_FORNECEDOR]),
  nome: z.string().trim().min(5),
  email: z.string().trim().email().or(zOptionalInput),
  cpf: zCPF.or(zOptionalInput),
  cnpj: zCNPJ.or(zOptionalInput),
  rg: z.string().trim().min(1).or(zOptionalInput),
  apelido: z.string().trim().min(1).or(zOptionalInput),
  endereco: z.string().trim().min(5).or(zOptionalInput),
  cep: zCEP.or(zOptionalInput),
  sexo: zNumberEnum([SEXO_MASCULINO, SEXO_FEMININO]).or(zOptionalInput),
  dn: zDate.or(zOptionalInput),
})

export const criarPessoaSchema = pessoaSchema.omit({ id: true, empresa_id: true, criador_id: true })
export const editarPessoaSchema = pessoaSchema.omit({ empresa_id: true, criador_id: true })

//* Esquemas de Usuário
export const usuarioSchema = z.object({
  id: z.coerce.number().int(),
  nome: z.string().trim().min(5),
  email: z.string().trim().email(),
  perm_usuario: z.coerce.number().int().default(0),
  senha: z.string().min(4),
})

export const addUsuarioSchema = usuarioSchema.omit({
  id: true
}).extend({
  senha_repetir: usuarioSchema.shape.senha,
}).refine((obj) => obj.senha === obj.senha_repetir, {
  message: "As senhas não correspondem",
  path: ["senha_repetir"],
}).transform((obj) => {
  delete obj.senha_repetir
  return obj
})

export const addUsuarioEmpresaSchema = usuarioSchema.omit({
  id: true, perm_usuario: true
}).extend({
  gpe_id: z.coerce.number().int(),
  senha_repetir: usuarioSchema.shape.senha,
}).refine((obj) => obj.senha === obj.senha_repetir, {
  message: "As senhas não correspondem",
  path: ["senha_repetir"],
})

export const editUsuarioEmpresaSchema = usuarioSchema.omit({
  perm_usuario: true
}).extend({
  nome: usuarioSchema.shape.nome.optional(),
  email: usuarioSchema.shape.email.optional(),
  senha: stringUndefined(usuarioSchema.shape.senha.optional()),
  senha_repetir: stringUndefined(usuarioSchema.shape.senha.optional()),
  gpe_id: z.coerce.number().int(),
}).refine((obj) => obj.senha === obj.senha_repetir, {
  message: "As senhas não correspondem",
  path: ["senha_repetir"],
}).transform(deleteUndefined)

export const editUsuarioSchema = usuarioSchema.extend({
  senha: stringUndefined(usuarioSchema.shape.senha.optional()),
  senha_repetir: stringUndefined(usuarioSchema.shape.senha.optional()),
}).refine((obj) => obj.senha === obj.senha_repetir, {
  message: "As senhas não correspondem",
  path: ["senha_repetir"],
}).transform((obj) => {
  delete obj.senha_repetir
  return obj
}).transform(deleteUndefined)

export const editPerfilUsuarioSchema = z.object({
  nome: usuarioSchema.shape.nome,
  email: usuarioSchema.shape.email,
})

export const alterarSenhaPerfilUsuarioSchema = z.object({
  senha: usuarioSchema.shape.senha,
  senha_repetir: usuarioSchema.shape.senha,
}).refine((obj) => obj.senha === obj.senha_repetir, {
  message: "As senhas não correspondem",
  path: ["senha_repetir"],
}).transform((obj) => ({ senha: obj.senha }))

//*************************** */

export const empresaSchema = z.object({
  id: z.coerce.number(),
  dono_id: z.coerce.number(),
  nome_fantasia: z.string().min(6),
  razao_social: z.string().optional().default(""),
  cnpj: z.string().optional().default(""),
  inscricao_estadual: z.string().optional().default(""),
  codigo_regime_tributario: z.string().optional().default(""),
  pais: z.string().optional().default(""),
  uf: z.string().optional().default(""),
  municipio: z.string().optional().default(""),
  bairro: z.string().optional().default(""),
  cep: z.string().optional().default(""),
  endereco: z.string().optional().default(""),
  telefone: z.string().optional().default(""),
})

export const criarEmpresaSchema = empresaSchema.omit({ id: true, dono_id: true })

export const editarEmpresaSchema = empresaSchema.omit({ dono_id: true })