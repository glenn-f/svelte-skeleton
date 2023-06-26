import { z } from "./zodBr";

export const addUsuarioSchema = z.object({
  nome: z.string().trim().min(5),
  email: z.string().email(),
  senha: z.string().nonempty("Digite a senha"),
  senha_repetir: z.string(),
  permUsuario: z.coerce.number().default(''),
}).refine((obj) => obj.senha === obj.senha_repetir, {
  message: "As senhas não correspondem",
  path: ["senha_repetir"],
})