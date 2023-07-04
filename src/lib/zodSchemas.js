import { z } from "./zodBr";
// import { z } from "zod";

function deleteUndefined(obj) {
  for (const key in obj)
    if (obj[key] === undefined)
      delete obj[key]
  return obj;
}

function stringUndefined(schema) {
  return z.preprocess(senha => senha || undefined, schema)
}

//* Esquemas genéricos
export const deleteIdSchema = z.object({
  id: z.coerce.number().int()
})

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