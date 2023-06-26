export const PERM_APP_ACESSO = 0
export const PERM_APP_CRIAR = 1
const PERM_APP = new Map()
PERM_APP.set(PERM_APP_ACESSO, { label: "Nível 0 - Colaborador" })
PERM_APP.set(PERM_APP_CRIAR, { label: "Nível 1 - Usuário" })

export { PERM_APP }
export const fmtMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })