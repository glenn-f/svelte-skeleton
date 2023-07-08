import { deleteUndefined, stringUndefined } from "$lib/zod"
import { zEmail, zID, z } from ".."

export const usuarioSchema = z.object({
  id: zID,
  nome: z.string().trim().min(5),
  email: zEmail,
  senha: z.string().min(4),
  perm_usuario: zID.default(0),
})

export const loginSchema = usuarioSchema.pick({ email: true, senha: true })

export const addUsuarioSchema = usuarioSchema.omit({ id: true }).extend({
  senha_repetir: usuarioSchema.shape.senha,
}).refine((obj) => obj.senha === obj.senha_repetir, {
  message: "As senhas não correspondem",
  path: ["senha_repetir"],
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