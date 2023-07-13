PRAGMA foreign_keys = ON;
-- Tabela "usuario"
CREATE TABLE IF NOT EXISTS usuario (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  criador_id INTEGER,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  senha TEXT NOT NULL,
  tipo_usuario INTEGER NOT NULL DEFAULT(0),
  criacao INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  delecao INTEGER,
  FOREIGN KEY (criador_id) REFERENCES usuario(id),
  UNIQUE (email)
) STRICT;
-- Tabela "sessao"
CREATE TABLE IF NOT EXISTS sessao (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER,
  expiracao INTEGER NOT NULL,
  criacao INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (usuario_id) REFERENCES usuario(id)
) STRICT;
-- Tabela "empresa"
CREATE TABLE IF NOT EXISTS empresa (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  dono_id INTEGER,
  nome_fantasia TEXT NOT NULL,
  razao_social TEXT,
  cnpj TEXT,
  inscricao_estadual TEXT,
  codigo_regime_tributario TEXT,
  pais TEXT,
  uf TEXT,
  municipio TEXT,
  bairro TEXT,
  cep TEXT,
  endereco TEXT,
  telefone TEXT,
  criacao INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  delecao INTEGER,
  FOREIGN KEY (dono_id) REFERENCES usuario(id),
  UNIQUE (dono_id)
) STRICT;
-- Tabela "grupo_permissao_empresa"
CREATE TABLE IF NOT EXISTS grupo_permissao_empresa (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  empresa_id INTEGER NOT NULL,
  nome TEXT NOT NULL,
  pode_iniciar_venda INTEGER NOT NULL DEFAULT(0),
  pode_ver_estoque_disponivel INTEGER NOT NULL DEFAULT(0),
  pode_ver_historico_vendas INTEGER NOT NULL DEFAULT(0),
  pode_ver_estoque INTEGER NOT NULL DEFAULT(0),
  pode_entrada_estoque INTEGER NOT NULL DEFAULT(0),
  pode_saida_estoque INTEGER NOT NULL DEFAULT(0),
  pode_ver_saldo INTEGER NOT NULL DEFAULT(0),
  pode_transacao_receita INTEGER NOT NULL DEFAULT(0),
  pode_transacao_despesa INTEGER NOT NULL DEFAULT(0),
  pode_cadastrar_produto INTEGER NOT NULL DEFAULT(0),
  pode_cadastrar_pessoa INTEGER NOT NULL DEFAULT(0),
  pode_cadastrar_conta INTEGER NOT NULL DEFAULT(0),
  pode_cadastrar_usuario INTEGER NOT NULL DEFAULT(0),
  criacao INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  delecao INTEGER,
  FOREIGN KEY (empresa_id) REFERENCES empresa(id),
  UNIQUE (empresa_id, nome)
) STRICT;
-- Tabela "pessoa"
CREATE TABLE IF NOT EXISTS pessoa (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  empresa_id INTEGER NOT NULL,
  criador_id INTEGER NOT NULL,
  tipo_pessoa INTEGER NOT NULL DEFAULT(1),
  rep INTEGER NOT NULL DEFAULT(1),
  nome TEXT NOT NULL,
  email TEXT,
  cpf TEXT,
  cnpj TEXT,
  rg TEXT,
  apelido TEXT,
  endereco TEXT,
  cep TEXT,
  sexo TEXT,
  dn INTEGER,
  criacao INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  delecao INTEGER,
  FOREIGN KEY (empresa_id) REFERENCES empresa(id),
  FOREIGN KEY (criador_id) REFERENCES usuario(id),
  UNIQUE (cpf, empresa_id),
  UNIQUE (cnpj, empresa_id)
) STRICT;
-- Tabela "usuario_empresa"
CREATE TABLE IF NOT EXISTS usuario_empresa (
  usuario_id INTEGER NOT NULL,
  empresa_id INTEGER NOT NULL,
  pessoa_id INTEGER NOT NULL,
  gpe_id INTEGER,
  criacao INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  delecao INTEGER,
  PRIMARY KEY (usuario_id, empresa_id),
  FOREIGN KEY (usuario_id) REFERENCES usuario(id),
  FOREIGN KEY (empresa_id) REFERENCES empresa(id),
  FOREIGN KEY (pessoa_id) REFERENCES pessoa(id),
  FOREIGN KEY (gpe_id) REFERENCES grupo_permissao_empresa(id),
  UNIQUE (pessoa_id)
) STRICT;
-- Tabela "categoria"
CREATE TABLE IF NOT EXISTS produto_categoria(
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  empresa_id INTEGER NOT NULL,
  nome TEXT NOT NULL,
  criacao INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  delecao INTEGER,
  FOREIGN KEY (empresa_id) REFERENCES empresa(id),
  UNIQUE (nome)
) STRICT;
--! Tabela "produto"
CREATE TABLE IF NOT EXISTS produto (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  empresa_id INTEGER NOT NULL,
  produto_categoria_id INTEGER,
  nome TEXT NOT NULL,
  titulo_codigo TEXT,
  config_json TEXT,
  criacao INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  delecao INTEGER,
  FOREIGN KEY (empresa_id) REFERENCES empresa(id),
  FOREIGN KEY (produto_categoria_id) REFERENCES produto_categoria(id),
  UNIQUE (nome)
) STRICT;
--! Tabela "regra_comissao"
CREATE TABLE IF NOT EXISTS regra_comissao (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  empresa_id INTEGER NOT NULL,
  bonus_fixo DECIMAL(14,4) NOT NULL,
  taxa_fixa DECIMAL(9,6) NOT NULL,
  nome TEXT NOT NULL,
  descricao TEXT,
  data_inicial INTEGER NOT NULL DEFAULT,
  data_final INTEGER NOT NULL,
  FOREIGN KEY (empresa_id) REFERENCES empresa(id)
) STRICT;
--! Tabela "produto_regra_comissao"
CREATE TABLE IF NOT EXISTS produto_regra_comissao (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  produto_id INTEGER NOT NULL,
  regra_comissao_id INTEGER NOT NULL,
  condicao TEXT NOT NULL,
  origem TEXT NOT NULL,
  FOREIGN KEY (produto_id) REFERENCES produto(id),
  FOREIGN KEY (regra_comissao_id) REFERENCES regra_comissao(id),
) STRICT;
--! Tabela "fechamento_comissao"
CREATE TABLE IF NOT EXISTS fechamento_comissao (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  pessoa_id INTEGER NOT NULL,
  regra_comissao_id INTEGER NOT NULL,
  bonus_fixo DECIMAL(14,4) NOT NULL,
  taxa_fixa DECIMAL(9,6) NOT NULL,
  efetivacao INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (pessoa_id) REFERENCES pessoa(id),
  FOREIGN KEY (regra_comissao_id) REFERENCES regra_comissao(id),
) STRICT;
--! Tabela "comissao"
CREATE TABLE IF NOT EXISTS comissao (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  regra_comissao_id INTEGER NOT NULL,
  pessoa_id INTEGER NOT NULL,
  fechamento_comissao_id INTEGER,
  tipo_comissao INTEGER NOT NULL,
  valor_fixo DECIMAL(14,4) NOT NULL,
  valor_taxa DECIMAL(14,4) NOT NULL,
  efetivacao INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (regra_comissao_id) REFERENCES regra_comissao(id),
  FOREIGN KEY (fechamento_comissao_id) REFERENCES fechamento_comissao(id),
  FOREIGN KEY (pessoa_id) REFERENCES pessoa(id)
) STRICT;
--! Tabela "fcg" Fluxo Contábil Grupo
CREATE TABLE IF NOT EXISTS fcg (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT) STRICT;
--! Tabela "fc" Fluxo Contábil
CREATE TABLE IF NOT EXISTS fc (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  empresa_id INTEGER NOT NULL,
  fcg_id INTEGER,
  classe_fc INTEGER NOT NULL,
  tipo_fc INTEGER NOT NULL,
  valor DECIMAL(14,4) NOT NULL,
  observacoes TEXT,
  efetivacao INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (empresa_id) REFERENCES empresa(id),
  FOREIGN KEY (fcg_id) REFERENCES fcg(id)
) STRICT;
--! Tabela "comissao_contabil"
CREATE TABLE IF NOT EXISTS comissao_contabil (
  comissao_id INTEGER NOT NULL,
  fc_id INTEGER NOT NULL,
  PRIMARY KEY (comissao_id, fc_id)
  FOREIGN KEY (comissao_id) REFERENCES comissao(id),
  FOREIGN KEY (fc_id) REFERENCES fc(id),
  UNIQUE (comissao_id),
  UNIQUE (fc_id)
) STRICT;
--! Tabela "estoque"
CREATE TABLE IF NOT EXISTS estoque (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  produto_id INTEGER NOT NULL,
  qntd INTEGER NOT NULL, -- transferivel, quantidade deste estoque (no estado atual: em avaliacao, disponivel)
  custo DECIMAL(14, 4) NOT NULL, -- transferivel,  custo bruto Acumulado do estoque (total custo_manutencao + total custo_entrada) 
  preco_unitario DECIMAL(14, 4), --atualizavel
  estado INTEGER NOT NULL DEFAULT 1, --atualizavel (disponivel para em avaliacao)
  condicao INTEGER NOT NULL DEFAULT 1, 
  origem INTEGER NOT NULL DEFAULT 1, 
  codigo TEXT,
  dados_json TEXT,
  observacoes TEXT,
  FOREIGN KEY (produto_id) REFERENCES produto(id)
) STRICT;
--! Tabela "pe" Processo Estoque
CREATE TABLE IF NOT EXISTS pe (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  empresa_id INTEGER NOT NULL,
  responsavel_id INTEGER,
  tipo_pe INTEGER NOT NULL,
  observacoes TEXT,
  efetivacao INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (usuario_id) REFERENCES usuario(id),
  FOREIGN KEY (empresa_id) REFERENCES empresa(id),
  FOREIGN KEY (responsavel_id) REFERENCES pessoa(id)
) STRICT;
--! Tabela "pe_fcg" Processo Estoque - Fluxo Contabil Grupo
CREATE TABLE IF NOT EXISTS pe_fcg (
  pe_id INTEGER NOT NULL,
  fcg_id INTEGER NOT NULL,
  PRIMARY KEY (pe_id, fcg_id)
  FOREIGN KEY (pe_id) REFERENCES pe(id),
  FOREIGN KEY (fcg_id) REFERENCES fcg(id),
  UNIQUE (fcg_id)
) STRICT;
--! Tabela "fe" Fluxo Estoque
CREATE TABLE IF NOT EXISTS fe (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  estoque_id INTEGER NOT NULL,
  pe_id INTEGER NOT NULL,
  responsavel_id INTEGER,
  qntd INTEGER NOT NULL,
  diferenca_preco DECIMAL(14, 4) NOT NULL,
  observacoes TEXT,
  FOREIGN KEY (estoque_id) REFERENCES estoque(id),
  FOREIGN KEY (pe_id) REFERENCES pe(id),
  FOREIGN KEY (responsavel_id) REFERENCES pessoa(id)
) STRICT;
--! Tabela "fc_fe" Fluxo Contabil-Estoque
CREATE TABLE IF NOT EXISTS fc_fe (
  fc_id INTEGER NOT NULL,
  fe_id INTEGER NOT NULL,
  valor_inicial DECIMAL(14, 4) NOT NULL,
  FOREIGN KEY (fc_id) REFERENCES fc(id),
  FOREIGN KEY (fe_id) REFERENCES fe(id),
  PRIMARY KEY (fc_id, fe_id),
  UNIQUE (fc_id)
) STRICT;
--! Tabela "conta"
CREATE TABLE IF NOT EXISTS conta (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  empresa_id INTEGER NOT NULL,
  nome TEXT NOT NULL,
  saldo DECIMAL(14,4) NOT NULL,
  FOREIGN KEY (empresa_id) REFERENCES empresa(id)
) STRICT;
--! Tabela "conta_forma"
CREATE TABLE IF NOT EXISTS conta_forma (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  conta_id INTEGER NOT NULL,
  nome TEXT NOT NULL,
  pode_receber INTEGER NOT NULL DEFAULT 1,
  pode_pagar INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (conta_id) REFERENCES conta(id)
) STRICT;
--! Tabela "forma_transacao"
CREATE TABLE IF NOT EXISTS forma_transacao (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  conta_forma_id INTEGER NOT NULL,
  nome TEXT,
  taxa_encargo DECIMAL(9,6) NOT NULL DEFAULT(0),
  FOREIGN KEY (conta_forma_id) REFERENCES conta_forma(id)
) STRICT;
--! Tabela "ff" Fluxo Financeiro
CREATE TABLE IF NOT EXISTS ff (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  conta_id INTEGER NOT NULL,
  tipo_ff INTEGER NOT NULL,
  valor DECIMAL(14,4) NOT NULL,
  observacoes TEXT,
  efetivacao INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (conta_id) REFERENCES conta(id)
) STRICT;
--! Tabela "fc_ff" Fluxo Contabil-Financeiro
CREATE TABLE IF NOT EXISTS fc_ff (
  fc_id INTEGER NOT NULL,
  ff_id INTEGER NOT NULL,
  PRIMARY KEY (fc_id, ff_id)
  FOREIGN KEY (fc_id) REFERENCES fc(id),
  FOREIGN KEY (ff_id) REFERENCES ff(id),
  UNIQUE (fc_id)
) STRICT;
--! Tabela "transacao"
CREATE TABLE IF NOT EXISTS transacao (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  transacao_ff_id INTEGER NOT NULL,
  encargo_ff_id INTEGER,
  forma_transacao_id INTEGER NOT NULL,
  FOREIGN KEY (transacao_ff_id) REFERENCES ff(id),
  FOREIGN KEY (encargo_ff_id) REFERENCES ff(id),
  FOREIGN KEY (forma_transacao_id) REFERENCES forma_transacao(id),
  UNIQUE (transacao_ff_id),
  UNIQUE (encargo_ff_id)
) STRICT;
--! Tabela "pe_transacao" Processo Estoque Transação (Fluxo)
CREATE TABLE IF NOT EXISTS pe_transacao (
  pe_id INTEGER NOT NULL,
  transacao_id INTEGER NOT NULL,
  FOREIGN KEY (pe_id) REFERENCES pe(id),
  FOREIGN KEY (transacao_id) REFERENCES transacao(id),
  PRIMARY KEY (pe_id, transacao_id),
  UNIQUE (transacao_id)
) STRICT;