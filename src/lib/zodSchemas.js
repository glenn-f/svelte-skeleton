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
  permUsuario: z.coerce.number().int().default(0),
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
