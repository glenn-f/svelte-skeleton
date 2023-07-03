export const PERM_APP_ACESSO = 0
export const PERM_APP_CRIAR = 1
export const PERM_APP_MASTER = 99
const PERM_APP = new Map()
PERM_APP.set(PERM_APP_ACESSO, { label: "00-Colaborador" })
PERM_APP.set(PERM_APP_CRIAR, { label: "01-Usuário" })
PERM_APP.set(PERM_APP_MASTER, { label: "99-Administrador" })

export { PERM_APP }
export const fmtMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })