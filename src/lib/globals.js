export const USUARIO_ADICIONAL = 0
export const USUARIO_MEMBRO = 1
export const USUARIO_ADMINISTRADOR = 99
const mapTipoUsuario = new Map()
mapTipoUsuario.set(USUARIO_ADICIONAL, "Adicional")
mapTipoUsuario.set(USUARIO_MEMBRO, "Membro")
mapTipoUsuario.set(USUARIO_ADMINISTRADOR, "Administrador")

export const REP_COLABORADOR = 1
export const REP_CLIENTE = 2
export const REP_FORNECEDOR = 3
const mapREP = new Map()
mapREP.set(REP_COLABORADOR, "Colaborador")
mapREP.set(REP_CLIENTE, "Cliente")
mapREP.set(REP_FORNECEDOR, "Fornecedor")

export const PESSOA_FISICA = 1
export const PESSOA_JURIDICA = 2
const mapTipoPessoa = new Map()
mapTipoPessoa.set(PESSOA_FISICA, "Física")
mapTipoPessoa.set(PESSOA_JURIDICA, "Jurídica")

export const SEXO_MASCULINO = 1
export const SEXO_FEMININO = 2
const mapSexo = new Map()
mapSexo.set(SEXO_MASCULINO, "Masculino")
mapSexo.set(SEXO_FEMININO, "Feminino")

export { mapREP, mapSexo, mapTipoPessoa, mapTipoUsuario }

export const fmtMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })