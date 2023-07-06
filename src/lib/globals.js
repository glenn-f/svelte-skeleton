export const USUARIO_FREE = 0
export const USUARIO_MEMBRO = 1
export const USUARIO_ADMINISTRADOR = 99
const mapTipoUsuario = new Map()
mapTipoUsuario.set(USUARIO_FREE, "Free")
mapTipoUsuario.set(USUARIO_MEMBRO, "Membro")
mapTipoUsuario.set(USUARIO_ADMINISTRADOR, "Administrador")

export const RELACIONAMENTO_COLABORADOR = 1
export const RELACIONAMENTO_CLIENTE = 2
export const RELACIONAMENTO_FORNECEDOR = 3
const mapRelacionamento = new Map()
mapRelacionamento.set(RELACIONAMENTO_COLABORADOR, "Colaborador")
mapRelacionamento.set(RELACIONAMENTO_CLIENTE, "Cliente")
mapRelacionamento.set(RELACIONAMENTO_FORNECEDOR, "Fornecedor")

export const PESSOA_FISICA = 1
export const PESSOA_JURIDICA = 2
const mapTipoPessoa = new Map()
mapTipoPessoa.set(PESSOA_FISICA, "Física")
mapTipoPessoa.set(PESSOA_JURIDICA, "Jurídica")

export { mapTipoUsuario, mapRelacionamento, mapTipoPessoa }

export const fmtMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })