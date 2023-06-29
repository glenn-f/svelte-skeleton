// import { z } from "./zodBr";
import { z } from "zod";

export const usuarioSchema = z.object({
  id: z.number(),
  nome: z.string().trim().min(5),
  email: z.string().email(),
  senha: z.string(),
  permUsuario: z.number(),
})

export const addUsuarioSchema = usuarioSchema.omit({ id: true }).extend({
  senha_repetir: z.string()
  permUsuario: z.coerce.number().default(''),
}).refine((obj) => obj.senha === obj.senha_repetir, {
  message: "As senhas não correspondem",
  path: ["senha_repetir"],
})

export const editUsuarioSchema = addUsuarioSchema.extend({
  id: z.coerce.number(),
  senha: addUsuarioSchema.shape.senha.optional(),
  senha_repetir: addUsuarioSchema.shape.senha_repetir.optional(),
})