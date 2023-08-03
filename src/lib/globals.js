export const ERRO_CAMPOS = 400
export const ERRO_N_AUTENTICADO = 401
export const ERRO_N_PERMITIDO = 403
export const ERRO_RN_ENCONTRADO = 404
export const ERRO_R_BLOQUEADO = 423
export const ERRO_E_REQUISICAO = 429
export const ERRO_SERVIDOR = 500
export const ERRO_N_IMPLEMENTADO = 501
export const ERRO_INDISPONIVEL = 503
const mapCausasErro = new Map()
mapCausasErro.set(ERRO_CAMPOS, 'Campos rejeitados')
mapCausasErro.set(ERRO_N_AUTENTICADO, 'Não autenticado')
mapCausasErro.set(ERRO_N_PERMITIDO, 'Não permitido')
mapCausasErro.set(ERRO_RN_ENCONTRADO, 'Recurso não encontrado')
mapCausasErro.set(ERRO_R_BLOQUEADO, 'Recurso bloqueado')
mapCausasErro.set(ERRO_E_REQUISICAO, 'Excesso de requisições')
mapCausasErro.set(ERRO_SERVIDOR, 'Erro no servidor')
mapCausasErro.set(ERRO_N_IMPLEMENTADO, 'Não implementado')
mapCausasErro.set(ERRO_INDISPONIVEL, 'Serviço indisponível')

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
export const FE_BUYBACK = 2
export const FE_ESTORNO_SAIDA = 100
export const FE_VENDA = 101
export const FE_EXTRAVIO = 102
export const FE_ROUBO = 103
export const FE_DEFEITO = 104
export const FE_ESTORNO_ENTRADA = 200
export const FE_DIVISAO = 201
export const FE_MELHORIA = 202
export const FE_AVARIA = 203
export const FE_ATUALIZACAO = 204
const mapFluxoEstoque = new Map()
mapFluxoEstoque.set(FE_COMPRA, "Compra")
mapFluxoEstoque.set(FE_BUYBACK, "Buyback")
mapFluxoEstoque.set(FE_ESTORNO_SAIDA, "Estorno Saída")
mapFluxoEstoque.set(FE_VENDA, "Venda")
mapFluxoEstoque.set(FE_EXTRAVIO, "Extravio")
mapFluxoEstoque.set(FE_ROUBO, "Roubo ou Furto")
mapFluxoEstoque.set(FE_DEFEITO, "Descarte po Defeito")
mapFluxoEstoque.set(FE_ESTORNO_ENTRADA, "Estorno Entrada")
mapFluxoEstoque.set(FE_DIVISAO, "Divisão de Estoque")
mapFluxoEstoque.set(FE_MELHORIA, "Melhoria")
mapFluxoEstoque.set(FE_AVARIA, "Avaria")
mapFluxoEstoque.set(FE_ATUALIZACAO, "Atualização de Dados")

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

export const FF_PAGAMENTO = 1
export const FF_RECEBIMENTO = 2
export const FF_ENCARGO = 3
const mapFluxoFinanceiro = new Map()
mapFluxoFinanceiro.set(FF_PAGAMENTO, "Pagamento")
mapFluxoFinanceiro.set(FF_RECEBIMENTO, "Recebimento")
mapFluxoFinanceiro.set(FF_ENCARGO, "Encargo de Transação")

export const FC_C_ESTORNO = 1
export const FC_C_COMPRA_MERCADORIA = 2
export const FC_C_MANUTENCAO = 3
export const FC_C_TRANSPORTE_MERCADORIA = 4
export const FC_C_ADUANEIRO = 5
export const FC_C_SEGURO = 6
export const FC_C_TAXA = 7
export const FC_C_JURO = 8
export const FC_C_MULTA = 9
export const FC_C_EMBALAGEM = 10
export const FC_C_BRINDE = 11
export const FC_C_TROCO = 12
export const FC_C_TRIBUTO = 13
export const FC_C_COMISSAO_EXTERNA = 14
export const FC_C_COMISSAO_PRODUTO = 15
export const FC_C_COMISSAO_SERVICO = 16
export const FC_C_ENCARGO_TRANSACAO = 17
export const FC_C_ENCARGO_REPASSADO = 18
export const FC_C_OUTRO = 1000
export const FC_R_ESTORNO = 1001
export const FC_R_VENDA_MERCADORIA = 1002
export const FC_R_ENCARGO = 1003
export const FC_R_TRIBUTO = 1004
export const FC_R_TROCO = 1005
export const FC_R_TAXA = 1006
export const FC_R_MULTA = 1007
export const FC_R_JURO = 1008
export const FC_R_EMBALAGEM = 1009
export const FC_R_GRATIFICACAO = 1010
export const FC_R_OUTRO = 2000
export const FC_D_ESTORNO = 2001
export const FC_D_OUTRO = 3000
export const FC_S_ESTORNO = 3001
export const FC_S_OUTRO = 4000
const mapFluxoContabil = new Map()
mapFluxoContabil.set(FC_C_OUTRO, 'Outro Custo')
mapFluxoContabil.set(FC_R_OUTRO, 'Outra Receita')
mapFluxoContabil.set(FC_D_OUTRO, 'Outra Despesa')
mapFluxoContabil.set(FC_S_OUTRO, 'Outro Capital Social')
mapFluxoContabil.set(FC_C_ESTORNO, 'Estorno Custo')
mapFluxoContabil.set(FC_R_ESTORNO, 'Estorno Receita')
mapFluxoContabil.set(FC_D_ESTORNO, 'Estorno Despesa')
mapFluxoContabil.set(FC_S_ESTORNO, 'Estorno Capital Social')
mapFluxoContabil.set(FC_C_COMPRA_MERCADORIA, 'Compra de Mercadoria')
mapFluxoContabil.set(FC_C_MANUTENCAO, 'Manutenção e Serviço')
mapFluxoContabil.set(FC_C_TRANSPORTE_MERCADORIA, 'Transporte de Mercadoria')
mapFluxoContabil.set(FC_C_ADUANEIRO, 'Desembaraço Aduaneiro')
mapFluxoContabil.set(FC_C_SEGURO, 'Seguro')
mapFluxoContabil.set(FC_C_TAXA, 'Taxa e Tarifa')
mapFluxoContabil.set(FC_C_JURO, 'Juro')
mapFluxoContabil.set(FC_C_MULTA, 'Multa')
mapFluxoContabil.set(FC_C_EMBALAGEM, 'Embalagem')
mapFluxoContabil.set(FC_C_BRINDE, 'Brinde')
mapFluxoContabil.set(FC_C_TROCO, 'Falta de Troco')
mapFluxoContabil.set(FC_C_TRIBUTO, 'Tributo')
mapFluxoContabil.set(FC_C_COMISSAO_EXTERNA, 'Comissão Externa')
mapFluxoContabil.set(FC_C_COMISSAO_PRODUTO, 'Comissão de Produto')
mapFluxoContabil.set(FC_C_COMISSAO_SERVICO, 'Comissão de Serviço')
mapFluxoContabil.set(FC_C_ENCARGO_TRANSACAO, 'Encargo de Transação')
mapFluxoContabil.set(FC_C_ENCARGO_REPASSADO, 'Encargo Repassado (-)')
mapFluxoContabil.set(FC_R_VENDA_MERCADORIA, 'Venda de Mercadoria')
mapFluxoContabil.set(FC_R_ENCARGO, 'Receita de Encargo')
mapFluxoContabil.set(FC_R_TRIBUTO, 'Receita de Tributo')
mapFluxoContabil.set(FC_R_TROCO, 'Excesso de Troco')
mapFluxoContabil.set(FC_R_TAXA, 'Receita de Taxa e Tarifas')
mapFluxoContabil.set(FC_R_MULTA, 'Receita de Multa')
mapFluxoContabil.set(FC_R_JURO, 'Receita de Juro')
mapFluxoContabil.set(FC_R_EMBALAGEM, 'Receita de Embalagem')
mapFluxoContabil.set(FC_R_GRATIFICACAO, 'Gratificação e Gorjeta')

export const FCC_CUSTO = 1
export const FCC_RECEITA = 2
export const FCC_DESPESA = 3
export const FCC_SOCIAL = 4
const mapFluxoContabilClasse = new Map()
mapFluxoContabilClasse.set(FCC_CUSTO, "Custo")
mapFluxoContabilClasse.set(FCC_RECEITA, "Receita")
mapFluxoContabilClasse.set(FCC_DESPESA, "Despesa")
mapFluxoContabilClasse.set(FCC_SOCIAL, "Capital Social")

export { mapCausasErro, mapREP, mapSexo, mapTipoPessoa, mapTipoUsuario, mapProcessoEstoque, mapFluxoEstoque, mapOrigem, mapCondicao, mapEstadoEstoque, mapFluxoFinanceiro, mapFluxoContabil, mapFluxoContabilClasse }

export const fmtMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })