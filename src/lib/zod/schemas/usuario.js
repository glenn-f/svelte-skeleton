import { z, zEmail, zID, zOptional } from ".."

export const usuarioSchema = z.object({
  id: zID,
  criador_id: zOptional(zID),
  nome: z.string().trim().min(5),
  email: zEmail,
  senha: z.string().min(4),
  tipo_usuario: zID.default(0),
})

export const usuarioEmpresaSchema = z.object({
  usuario_id: zID,
  empresa_id: zID,
  pessoa_id: zID,
  gpe_id: zOptional(zID),
})

//! Esquemas e Validadores comuns
const alterarSenha = usuarioSchema.pick({
  id: true,
  senha: true
}).extend({
  senha_repetir: usuarioSchema.shape.senha,
})

function validarSenha(v) {
  return v.senha === v.senha_repetir
}

const erroValidarSenha = {
  message: "As senhas não correspondem",
  path: ["senha_repetir"],
}

//* Login
export const loginSchema = usuarioSchema.pick({
  email: true,
  senha: true
})

//* Administração.Usuários
export const addUsuarioSchema = usuarioSchema.pick({
  nome: true,
  email: true,
  senha: true,
  tipo_usuario: true
}).extend({
  senha_repetir: usuarioSchema.shape.senha
}).refine(validarSenha, erroValidarSenha)

export const editUsuarioSchema = usuarioSchema.pick({
  id: true,
  nome: true,
  email: true,
  tipo_usuario: true
})

export const alterarSenhaUsuarioSchema = alterarSenha.refine(validarSenha, erroValidarSenha)

//* Cadastros.Usuários (Empresa)
export const addUsuarioEmpresaSchema = usuarioSchema.pick({
  nome: true,
  email: true,
  senha: true,
}).extend({
  senha_repetir: usuarioSchema.shape.senha,
  gpe_id: usuarioEmpresaSchema.shape.gpe_id,
}).refine(validarSenha, erroValidarSenha)

export const editUsuarioEmpresaSchema = usuarioSchema.pick({
  id: true,
  nome: true,
  email: true,
}).extend({
  gpe_id: usuarioEmpresaSchema.shape.gpe_id,
})

export const alterarSenhaUsuarioEmpresaSchema = alterarSenha.refine(validarSenha, erroValidarSenha)

//* Perfil.Usuario (Meus Dados)
export const editPerfilUsuarioSchema = z.object({
  nome: usuarioSchema.shape.nome,
  email: usuarioSchema.shape.email,
})

export const alterarSenhaPerfilUsuarioSchema = alterarSenha.pick({
  senha: true,
  senha_repetir: true
}).refine(validarSenha, erroValidarSenha)