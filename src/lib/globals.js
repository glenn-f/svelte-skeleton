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

export const PE_COMPRA = 1
export const PE_VENDA = 2
const mapProcessoEstoque = new Map()
mapProcessoEstoque.set(PE_COMPRA, "Compra de Mercadorias")
mapProcessoEstoque.set(PE_VENDA, "Venda de Mercadorias")

export const FE_COMPRA = 1
export const FE_VENDA = 2
export const FE_BUYBACK = 3
const mapFluxoEstoque = new Map()
mapFluxoEstoque.set(FE_COMPRA, "Compra (Entrada)")
mapFluxoEstoque.set(FE_VENDA, "Venda (Saída)")
mapFluxoEstoque.set(FE_BUYBACK, "Buyback (Entrada)")

export const ORIGEM_NACIONAL = 1
export const ORIGEM_IMPORTADO = 2
export const ORIGEM_LOCAL = 3
const mapOrigem = new Map()
mapOrigem.set(ORIGEM_NACIONAL, "Nacional")
mapOrigem.set(ORIGEM_IMPORTADO, "Importado")
mapOrigem.set(ORIGEM_LOCAL, "Local")

export const CONDICAO_NOVO = 1
export const CONDICAO_SEMINOVO = 2
export const CONDICAO_AVARIADO = 3
const mapCondicao = new Map()
mapCondicao.set(CONDICAO_NOVO, "Novo")
mapCondicao.set(CONDICAO_SEMINOVO, "Semi-Novo")
mapCondicao.set(CONDICAO_AVARIADO, "Avariado")

export const EE_DISPONIVEL = 1
export const EE_AVALIACAO = 2
export const EE_USOINTERNO = 3
export const EE_MANUTENCAO = 4
export const EE_AUDITORIA = 5
const mapEstadoEstoque = new Map()
mapEstadoEstoque.set(EE_DISPONIVEL, "Disponível")
mapEstadoEstoque.set(EE_AVALIACAO, "Em Avaliação")
mapEstadoEstoque.set(EE_USOINTERNO, "Em Uso Interno")
mapEstadoEstoque.set(EE_MANUTENCAO, "Em Manutenção")
mapEstadoEstoque.set(EE_AUDITORIA, "Em Auditoria")

export { mapREP, mapSexo, mapTipoPessoa, mapTipoUsuario, mapProcessoEstoque, mapFluxoEstoque, mapOrigem, mapCondicao, mapEstadoEstoque, }

export const fmtMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })