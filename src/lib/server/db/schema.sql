-- Active: 1687020775859@@127.0.0.1@3306
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS usuario (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    senha TEXT NOT NULL,
    perm_usuario INTEGER NOT NULL DEFAULT(0),
    criador_id INTEGER NULL,
    criacao INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
    delecao INTEGER,
    FOREIGN KEY (criador_id) REFERENCES usuario(id),
    UNIQUE (email)
) STRICT;
CREATE TABLE IF NOT EXISTS sessao (
    id TEXT NOT NULL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    expiracao INTEGER NOT NULL,
    criacao INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
) STRICT;
INSERT
    OR REPLACE INTO usuario (id, nome, email, senha, perm_usuario)
VALUES
    (
        0,
        'Administrador',
        'a@d.min',
        '$2b$10$kgAkctImz3V8beH8rUcp5eUxa8N4FUWrI4DQ2J30sePHSVmzNqj9C',
        99
    );
--senha123
CREATE TABLE IF NOT EXISTS empresa (
    id INTEGER NOT NULL primary key autoincrement,
    dono_id INTEGER NOT NULL,
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
CREATE TABLE IF NOT EXISTS pessoa (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    empresa_id INTEGER NOT NULL,
    criador_id INTEGER NOT NULL,
    tipo_pessoa INTEGER NOT NULL DEFAULT(1),
    tipo_associacao INTEGER NOT NULL DEFAULT(1),
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
CREATE TABLE IF NOT EXISTS usuario_empresa(
    usuario_id INTEGER NOT NULL,
    empresa_id INTEGER NOT NULL,
    pessoa_id INTEGER NOT NULL,
    gpe_id INTEGER NOT NULL DEFAULT(0),
    criacao INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
    delecao INTEGER,
    PRIMARY KEY (usuario_id, empresa_id),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    FOREIGN KEY (empresa_id) REFERENCES empresa(id),
    FOREIGN KEY (pessoa_id) REFERENCES pessoa(id),
    FOREIGN KEY (gpe_id) REFERENCES grupo_permissao_empresa(id),
    UNIQUE (pessoa_id)
) STRICT;