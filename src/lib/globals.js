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
export const PE_VENDA = 101
export const PE_VENDA_COM_BUYBACK = 102
export const PE_PERDA = 103
export const PE_ALTERACAO = 201
export const PE_LANCAMENTO = 202
export const PE_ESTORNO_PARCIAL = 301
export const PE_ESTORNO_TOTAL = 302
const mapProcessoEstoque = new Map()
mapProcessoEstoque.set(PE_COMPRA, "Compra")
mapProcessoEstoque.set(PE_VENDA, "Venda")
mapProcessoEstoque.set(PE_VENDA_COM_BUYBACK, "Venda com Buyback")
mapProcessoEstoque.set(PE_PERDA, "Perda de Estoque")
mapProcessoEstoque.set(PE_ALTERACAO, "Alteração de Processo")
mapProcessoEstoque.set(PE_LANCAMENTO, "Lançamento em Inventário")
mapProcessoEstoque.set(PE_ESTORNO_PARCIAL, "Estorno Parcial")
mapProcessoEstoque.set(PE_ESTORNO_TOTAL, "Estorno Total")
export const PES_SAIDA = new Map(Array.from(mapProcessoEstoque.entries()).filter(([value]) => value > 100 && value <= 200))

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
mapFluxoEstoque.set(FE_DEFEITO, "Descarte ou Defeito")
mapFluxoEstoque.set(FE_ESTORNO_ENTRADA, "Estorno Entrada")
mapFluxoEstoque.set(FE_DIVISAO, "Divisão de Estoque")
mapFluxoEstoque.set(FE_MELHORIA, "Melhoria")
mapFluxoEstoque.set(FE_AVARIA, "Avaria")
mapFluxoEstoque.set(FE_ATUALIZACAO, "Atualização de Dados")
export const mapFEPerdas = new Map()
mapFEPerdas.set(FE_EXTRAVIO, "Extravio")
mapFEPerdas.set(FE_ROUBO, "Roubo ou Furto")
mapFEPerdas.set(FE_DEFEITO, "Descarte ou Defeito")

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
export const FC_C_MANUTENCAO_MELHORIA = 3
export const FC_C_TRANSPORTE_ENTREGA = 4
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
export const FC_C_TRIBUTO_ENTRADA = 19
export const FC_C_CASHBACK = 20
export const FC_C_RECOMPRA_MERCADORIA = 21
export const FC_C_OUTRO = 1000
export const FC_R_ESTORNO = 1001
export const FC_R_VENDA_MERCADORIA = 1002
export const FC_R_ENCARGO = 1003
export const FC_R_TRIBUTO = 1004
export const FC_R_EXCESSO_TROCO = 1005
export const FC_R_TAXA = 1006
export const FC_R_MULTA = 1007
export const FC_R_FINANCEIRA = 1008
export const FC_R_EMBALAGEM = 1009
export const FC_R_GRATIFICACAO = 1010
export const FC_R_SERVICO_ENTREGA = 1011
export const FC_R_FALTA_TROCO = 1012
export const FC_R_PROMOCAO = 1013
export const FC_R_CUPOM = 1014
export const FC_R_DESCONTO_GERENCIA = 1015
export const FC_R_OUTRO_DESCONTO = 1016
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
mapFluxoContabil.set(FC_C_RECOMPRA_MERCADORIA, 'Recompra de Mercadoria')
mapFluxoContabil.set(FC_C_MANUTENCAO_MELHORIA, 'Manutenção e Melhoria')
mapFluxoContabil.set(FC_C_TRANSPORTE_ENTREGA, 'Transporte e Entrega')
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
mapFluxoContabil.set(FC_C_ENCARGO_REPASSADO, 'Encargo Repassado (+)')
mapFluxoContabil.set(FC_C_TRIBUTO_ENTRADA, 'Tributo de Entrada (+)')
mapFluxoContabil.set(FC_C_CASHBACK, 'Cashback de Pagamento (+)')

mapFluxoContabil.set(FC_R_VENDA_MERCADORIA, 'Venda de Mercadoria')
mapFluxoContabil.set(FC_R_ENCARGO, 'Receita de Encargo')
mapFluxoContabil.set(FC_R_TRIBUTO, 'Receita de Tributo')
mapFluxoContabil.set(FC_R_EXCESSO_TROCO, 'Excesso de Troco')
mapFluxoContabil.set(FC_R_TAXA, 'Taxa ou Tarifa sobre Venda')
mapFluxoContabil.set(FC_R_MULTA, 'Multa sobre Venda')
mapFluxoContabil.set(FC_R_FINANCEIRA, 'Receita Financeira')
mapFluxoContabil.set(FC_R_EMBALAGEM, 'Venda de Embalagem')
mapFluxoContabil.set(FC_R_GRATIFICACAO, 'Gratificação e Gorjeta')
mapFluxoContabil.set(FC_R_SERVICO_ENTREGA, 'Serviço de Entrega')
mapFluxoContabil.set(FC_R_FALTA_TROCO, 'Desconto por Falta de Troco (-)')
mapFluxoContabil.set(FC_R_PROMOCAO, 'Desconto Promoção (-)')
mapFluxoContabil.set(FC_R_CUPOM, 'Desconto Cupom (-)')
mapFluxoContabil.set(FC_R_DESCONTO_GERENCIA, 'Desconto Gerência (-)')
mapFluxoContabil.set(FC_R_OUTRO_DESCONTO, 'Outro Desconto (-)')

export const FCC_CUSTO = 1
export const FCC_RECEITA = 2
export const FCC_DESPESA = 3
export const FCC_SOCIAL = 4
const mapFluxoContabilClasse = new Map()
mapFluxoContabilClasse.set(FCC_CUSTO, "Custo")
mapFluxoContabilClasse.set(FCC_RECEITA, "Receita")
mapFluxoContabilClasse.set(FCC_DESPESA, "Despesa")
mapFluxoContabilClasse.set(FCC_SOCIAL, "Capital Social")

function getTipos(classe) {
  const lim_inf = (classe - 1) * 1000
  const lim_sup = lim_inf + 1000
  const tipos = []
  for (const [value, label] of mapFluxoContabil.entries())
    if (value > lim_inf && value <= lim_sup)
      tipos.push({ label, value })
  return tipos
}

export function getClasseContabil(tipo) {
  const classe = Math.ceil(tipo / 1000)
  return mapFluxoContabilClasse.get(classe)
}

export const TIPOS_RECEITA = getTipos(FCC_RECEITA)
export const TIPOS_CUSTO = getTipos(FCC_CUSTO)
export const TIPOS_DESPESA = getTipos(FCC_DESPESA)
export const TIPOS_SOCIAL = getTipos(FCC_SOCIAL)
export const isCusto = (id) => id >= 1 && id <= 1000
export const isReceita = (id) => id >= 1001 && id <= 2000
export const isDespesa = (id) => id >= 2001 && id <= 3000
export const isCapitalSocial = (id) => id >= 3001 && id <= 4000

export const mapSaidaFC = {
  receitas: [
    { nome: "Embalagem", desc: "Adicionar embalagem à venda, pago ao cliente", classe: FCC_RECEITA, multiplicador: 1, tipo_fc: FC_R_EMBALAGEM },
    { nome: "Entrega/Transporte", desc: "Adicionar serviço de entrega ou delivery à venda, pago ao cliente", classe: FCC_RECEITA, multiplicador: 1, tipo_fc: FC_R_SERVICO_ENTREGA },
    { nome: "Taxa/Tarifa", desc: "Adicionar taxa ou tarifa sobre a venda, pago pelo cliente", classe: FCC_RECEITA, multiplicador: 1, tipo_fc: FC_R_TAXA },
    { nome: "Multa", desc: "Adicionar multa sobre venda, pago pelo cliente", classe: FCC_RECEITA, multiplicador: 1, tipo_fc: FC_R_MULTA },
    { nome: "Gratificação", desc: "Adicionar gratificação ou gorjeta, pago pelo cliente", classe: FCC_RECEITA, multiplicador: 1, tipo_fc: FC_R_GRATIFICACAO },
    { nome: "Excesso de Troco", desc: "Adicionar excesso de troco recebido", classe: FCC_RECEITA, multiplicador: 1, tipo_fc: FC_R_EXCESSO_TROCO },
    { nome: "Outro Valor", desc: "Adicionar outro valor a venda, pago pelo cliente", classe: FCC_RECEITA, multiplicador: 1, tipo_fc: FC_R_OUTRO },
  ],
  descontos: [
    { nome: "Promoção", desc: "Adicionar desconto de promoção à venda", classe: FCC_RECEITA, multiplicador: -1, tipo_fc: FC_R_PROMOCAO },
    { nome: "Cupom", desc: "Adicionar desconto de cupom à venda", classe: FCC_RECEITA, multiplicador: -1, tipo_fc: FC_R_CUPOM },
    { nome: "Gerência", desc: "Adicionar desconto autorizado pela Gerência à venda", classe: FCC_RECEITA, multiplicador: -1, tipo_fc: FC_R_DESCONTO_GERENCIA },
    { nome: "Falta de Troco", desc: "Adicionar desconto por falta de troco à venda", classe: FCC_RECEITA, multiplicador: -1, tipo_fc: FC_R_FALTA_TROCO },
    { nome: "Outro Desconto", desc: "Adicionar outro desconto à venda", classe: FCC_RECEITA, multiplicador: -1, tipo_fc: FC_R_OUTRO_DESCONTO },

  ],
  custos: [
    { nome: "Comissão Externa", desc: "Adicionar custo de comissão externa", classe: FCC_CUSTO, multiplicador: -1, tipo_fc: FC_C_COMISSAO_EXTERNA },
    { nome: "Brinde", desc: "Adicionar custo de brinde", classe: FCC_CUSTO, multiplicador: -1, tipo_fc: FC_C_BRINDE },
    { nome: "Tributo", desc: "Adicionar custo de tributos", classe: FCC_CUSTO, multiplicador: -1, tipo_fc: FC_C_TRIBUTO },
    { nome: "Taxa/Tarifa", desc: "Adicionar custo de taxas e tarifas", classe: FCC_CUSTO, multiplicador: -1, tipo_fc: FC_C_TAXA },
    { nome: "Outro Custo", desc: "Adicionar outros custos", classe: FCC_CUSTO, multiplicador: -1, tipo_fc: FC_C_OUTRO },
  ],
}

export const mapEntradaFC = {
  custos: [
    { nome: "Manutenção/Melhoria", desc: "Adicionar custo de manutenção ou melhoria de mercadoria", classe: FCC_CUSTO, multiplicador: -1, tipo_fc: FC_C_MANUTENCAO_MELHORIA },
    { nome: "Transporte/Delivery", desc: "Adicionar custo de transporte e delivery", classe: FCC_CUSTO, multiplicador: -1, tipo_fc: FC_C_TRANSPORTE_ENTREGA },
    { nome: "Desembaraço Aduaneiro", desc: "Adicionar custo de desembaraço aduaneiro e afins", classe: FCC_CUSTO, multiplicador: -1, tipo_fc: FC_C_ADUANEIRO },
    { nome: "Seguro", desc: "Adicionar custo de seguros contratados", classe: FCC_CUSTO, multiplicador: -1, tipo_fc: FC_C_SEGURO },
    { nome: "Taxa/Tarifa", desc: "Adicionar custo de taxas e tarifas pagas", classe: FCC_CUSTO, multiplicador: -1, tipo_fc: FC_C_TAXA },
    { nome: "Juro", desc: "Adicionar custo de juro em geral", classe: FCC_CUSTO, multiplicador: -1, tipo_fc: FC_C_JURO },
    { nome: "Multa", desc: "Adicionar custo de multas de qualquer tipo", classe: FCC_CUSTO, multiplicador: -1, tipo_fc: FC_C_MULTA },
    { nome: "Embalagem", desc: "Adicionar custo de embalagem", classe: FCC_CUSTO, multiplicador: -1, tipo_fc: FC_C_EMBALAGEM },
    { nome: "Falta de Troco", desc: "Adicionar falta de troco como custo", classe: FCC_CUSTO, multiplicador: -1, tipo_fc: FC_C_TROCO },
    { nome: "Tributo", desc: "Adicionar custo de tributos pagos", classe: FCC_CUSTO, multiplicador: -1, tipo_fc: FC_C_TRIBUTO },
    { nome: "Comissão Externa", desc: "Adicionar custo de comissão externa em geral", classe: FCC_CUSTO, multiplicador: -1, tipo_fc: FC_C_COMISSAO_EXTERNA },
    { nome: "Outro Custo", desc: "Adicionar outros custos", classe: FCC_CUSTO, multiplicador: -1, tipo_fc: FC_C_OUTRO },
  ],
  creditos: [
    { nome: "Tributo de Entrada", desc: "Adicionar crédito tributário de entrada", classe: FCC_CUSTO, multiplicador: 1, tipo_fc: FC_C_TRIBUTO_ENTRADA },
    { nome: "Cashback", desc: "Adicionar cashback e outras formas de retorno de pagamento", classe: FCC_CUSTO, multiplicador: 1, tipo_fc: FC_C_CASHBACK },
  ],
}

export const mapLancamentoFC = {
  custos: [
    { nome: "Manutenção/Melhoria", desc: "Adicionar custo de manutenção ou melhoria de mercadoria", classe: FCC_CUSTO, multiplicador: -1, tipo_fc: FC_C_MANUTENCAO_MELHORIA },
    { nome: "Transporte/Delivery", desc: "Adicionar custo de transporte e delivery", classe: FCC_CUSTO, multiplicador: -1, tipo_fc: FC_C_TRANSPORTE_ENTREGA },
    { nome: "Embalagem", desc: "Adicionar custo de embalagem", classe: FCC_CUSTO, multiplicador: -1, tipo_fc: FC_C_EMBALAGEM },
    { nome: "Desembaraço Aduaneiro", desc: "Adicionar custo de desembaraço aduaneiro e afins", classe: FCC_CUSTO, multiplicador: -1, tipo_fc: FC_C_ADUANEIRO },
    { nome: "Seguro", desc: "Adicionar custo de seguros contratados", classe: FCC_CUSTO, multiplicador: -1, tipo_fc: FC_C_SEGURO },
    { nome: "Taxa/Tarifa", desc: "Adicionar custo de taxas e tarifas pagas", classe: FCC_CUSTO, multiplicador: -1, tipo_fc: FC_C_TAXA },
    { nome: "Juro", desc: "Adicionar custo de juro em geral", classe: FCC_CUSTO, multiplicador: -1, tipo_fc: FC_C_JURO },
    { nome: "Multa", desc: "Adicionar custo de multas de qualquer tipo", classe: FCC_CUSTO, multiplicador: -1, tipo_fc: FC_C_MULTA },
    { nome: "Falta de Troco", desc: "Adicionar falta de troco como custo", classe: FCC_CUSTO, multiplicador: -1, tipo_fc: FC_C_TROCO },
    { nome: "Tributo", desc: "Adicionar custo de tributos pagos", classe: FCC_CUSTO, multiplicador: -1, tipo_fc: FC_C_TRIBUTO },
    { nome: "Comissão Externa", desc: "Adicionar custo de comissão externa em geral", classe: FCC_CUSTO, multiplicador: -1, tipo_fc: FC_C_COMISSAO_EXTERNA },
    { nome: "Outro Custo", desc: "Adicionar outros custos", classe: FCC_CUSTO, multiplicador: -1, tipo_fc: FC_C_OUTRO },
  ],
  creditos: [
    { nome: "Tributo de Entrada", desc: "Adicionar crédito tributário de entrada", classe: FCC_CUSTO, multiplicador: 1, tipo_fc: FC_C_TRIBUTO_ENTRADA },
    { nome: "Cashback", desc: "Adicionar cashback e outras formas de retorno de pagamento", classe: FCC_CUSTO, multiplicador: 1, tipo_fc: FC_C_CASHBACK },
    { nome: "Estorno", desc: "Estorno de custo de processos anteriores", classe: FCC_CUSTO, multiplicador: 1, tipo_fc: FC_C_ESTORNO },
  ],
}

export { mapCausasErro, mapCondicao, mapEstadoEstoque, mapFluxoContabil, mapFluxoContabilClasse, mapFluxoEstoque, mapFluxoFinanceiro, mapOrigem, mapProcessoEstoque, mapREP, mapSexo, mapTipoPessoa, mapTipoUsuario }

