-- Tabela "usuario"
CREATE TABLE usuario (
  id INTEGER PRIMARY KEY,
  nome TEXT,
  criador_id INTEGER,
  FOREIGN KEY (criador_id) REFERENCES usuario(id)
);
-- Tabela "sessao"
CREATE TABLE sessao (
  id INTEGER PRIMARY KEY,
  usuario_id INTEGER,
  FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);
-- Tabela "empresa"
CREATE TABLE empresa (
  id INTEGER PRIMARY KEY,
  dono_id INTEGER,
  FOREIGN KEY (dono_id) REFERENCES usuario(id)
);
-- Tabela "grupo_permissao_empresa"
CREATE TABLE grupo_permissao_empresa (
  id INTEGER PRIMARY KEY,
  empresa_id INTEGER,
  FOREIGN KEY (empresa_id) REFERENCES empresa(id)
);
-- Tabela "pessoa"
CREATE TABLE pessoa (
  id INTEGER PRIMARY KEY,
  criador_id INTEGER,
  empresa_id INTEGER,
  FOREIGN KEY (criador_id) REFERENCES usuario(id),
  FOREIGN KEY (empresa_id) REFERENCES empresa(id)
);
-- Tabela "usuario_empresa"
CREATE TABLE usuario_empresa (
  usuario_id INTEGER,
  empresa_id INTEGER,
  pessoa_id INTEGER,
  gpe_id INTEGER,
  FOREIGN KEY (usuario_id) REFERENCES usuario(id),
  FOREIGN KEY (empresa_id) REFERENCES empresa(id),
  FOREIGN KEY (pessoa_id) REFERENCES pessoa(id),
  FOREIGN KEY (gpe_id) REFERENCES grupo_permissao_empresa(id),
  PRIMARY KEY (usuario_id, empresa_id)
);
-- Tabela "categoria"
CREATE TABLE categoria (
  id INTEGER PRIMARY KEY,
  empresa_id INTEGER,
  FOREIGN KEY (empresa_id) REFERENCES empresa(id)
);
-- Tabela "produto"
CREATE TABLE produto (
  id INTEGER PRIMARY KEY,
  empresa_id INTEGER,
  categoria_id INTEGER,
  FOREIGN KEY (empresa_id) REFERENCES empresa(id),
  FOREIGN KEY (categoria_id) REFERENCES categoria(id)
);
-- Tabela "regra_comissao"
CREATE TABLE regra_comissao (
  id INTEGER PRIMARY KEY,
  empresa_id INTEGER,
  FOREIGN KEY (empresa_id) REFERENCES empresa(id)
);
-- Tabela "produto_regra_comissao"
CREATE TABLE produto_regra_comissao (
  produto_id INTEGER,
  regra_comissao_id INTEGER,
  FOREIGN KEY (produto_id) REFERENCES produto(id),
  FOREIGN KEY (regra_comissao_id) REFERENCES regra_comissao(id),
  PRIMARY KEY (produto_id, regra_comissao_id)
);
-- Tabela "fechamento_comissao"
CREATE TABLE fechamento_comissao (
  pessoa_id INTEGER,
  regra_comissao_id INTEGER,
  FOREIGN KEY (pessoa_id) REFERENCES pessoa(id),
  FOREIGN KEY (regra_comissao_id) REFERENCES regra_comissao(id),
  PRIMARY KEY (pessoa_id, regra_comissao_id)
);
-- Tabela "comissao"
CREATE TABLE comissao (
  id INTEGER PRIMARY KEY,
  regra_comissao_id INTEGER,
  fechamento_comissao_id INTEGER,
  pessoa_id INTEGER,
  FOREIGN KEY (regra_comissao_id) REFERENCES regra_comissao(id),
  FOREIGN KEY (fechamento_comissao_id) REFERENCES fechamento_comissao(id),
  FOREIGN KEY (pessoa_id) REFERENCES pessoa(id)
);
-- Tabela "fcg"
CREATE TABLE fcg (id INTEGER PRIMARY KEY);
-- Tabela "fc"
CREATE TABLE fc (
  id INTEGER PRIMARY KEY,
  empresa_id INTEGER,
  fcg_id INTEGER,
  FOREIGN KEY (empresa_id) REFERENCES empresa(id),
  FOREIGN KEY (fcg_id) REFERENCES fcg(id)
);
-- Tabela "comissao_contabil"
CREATE TABLE comissao_contabil (
  comissao_id INTEGER,
  fc_id INTEGER,
  FOREIGN KEY (comissao_id) REFERENCES comissao(id),
  FOREIGN KEY (fc_id) REFERENCES fc(id),
  PRIMARY KEY (comissao_id, fc_id)
);
-- Tabela "estoque"
CREATE TABLE estoque (
  id INTEGER PRIMARY KEY,
  produto_id INTEGER,
  FOREIGN KEY (produto_id) REFERENCES produto(id)
);
-- Tabela "pe"
CREATE TABLE pe (
  id INTEGER PRIMARY KEY,
  usuario_id INTEGER,
  empresa_id INTEGER,
  responsavel_id INTEGER,
  FOREIGN KEY (usuario_id) REFERENCES usuario(id),
  FOREIGN KEY (empresa_id) REFERENCES empresa(id),
  FOREIGN KEY (responsavel_id) REFERENCES pessoa(id)
);
-- Tabela "pe_fcg"
CREATE TABLE pe_fcg (
  pe_id INTEGER,
  fcg_id INTEGER,
  FOREIGN KEY (pe_id) REFERENCES pe(id),
  FOREIGN KEY (fcg_id) REFERENCES fcg(id),
  PRIMARY KEY (pe_id, fcg_id)
);
-- Tabela "fe"
CREATE TABLE fe (
  id INTEGER PRIMARY KEY,
  estoque_id INTEGER,
  pe_id INTEGER,
  FOREIGN KEY (estoque_id) REFERENCES estoque(id),
  FOREIGN KEY (pe_id) REFERENCES pe(id)
);
-- Tabela "fc_fe"
CREATE TABLE fc_fe (
  fc_id INTEGER,
  fe_id INTEGER,
  FOREIGN KEY (fc_id) REFERENCES fc(id),
  FOREIGN KEY (fe_id) REFERENCES fe(id),
  PRIMARY KEY (fc_id, fe_id)
);
-- Tabela "conta"
CREATE TABLE conta (
  id INTEGER PRIMARY KEY,
  empresa_id INTEGER,
  FOREIGN KEY (empresa_id) REFERENCES empresa(id)
);
-- Tabela "conta_forma"
CREATE TABLE conta_forma (
  conta_id INTEGER,
  FOREIGN KEY (conta_id) REFERENCES conta(id),
  PRIMARY KEY (conta_id)
);
-- Tabela "forma_transacao"
CREATE TABLE forma_transacao (
  id INTEGER PRIMARY KEY,
  conta_forma_id INTEGER,
  FOREIGN KEY (conta_forma_id) REFERENCES conta_forma(id)
);
-- Tabela "ff"
CREATE TABLE ff (
  id INTEGER PRIMARY KEY,
  conta_id INTEGER,
  FOREIGN KEY (conta_id) REFERENCES conta(id)
);
-- Tabela "fc_ff"
CREATE TABLE fc_ff (
  fc_id INTEGER,
  ff_id INTEGER,
  FOREIGN KEY (fc_id) REFERENCES fc(id),
  FOREIGN KEY (ff_id) REFERENCES ff(id),
  PRIMARY KEY (fc_id, ff_id)
);
-- Tabela "transacao"
CREATE TABLE transacao (
  id INTEGER PRIMARY KEY,
  transacao_ff_id INTEGER,
  encargo_ff_id INTEGER,
  forma_transacao_id INTEGER,
  FOREIGN KEY (transacao_ff_id) REFERENCES ff(id),
  FOREIGN KEY (encargo_ff_id) REFERENCES ff(id),
  FOREIGN KEY (forma_transacao_id) REFERENCES forma_transacao(id)
);
-- Tabela "pe_transacao"
CREATE TABLE pe_transacao (
  pe_id INTEGER,
  transacao_id INTEGER,
  FOREIGN KEY (pe_id) REFERENCES pe(id),
  FOREIGN KEY (transacao_id) REFERENCES transacao(id),
  PRIMARY KEY (pe_id, transacao_id)
);