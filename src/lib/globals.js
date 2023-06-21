export const PERM_APP_ACESSO = 0
export const PERM_APP_CRIAR = 1
export const PERM_APP = Object.freeze({
  [PERM_APP_ACESSO]: "Nível 0 - Acesso",
  [PERM_APP_CRIAR]: "Nível 1 - Criar Empresa",
})

export const fmtMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })