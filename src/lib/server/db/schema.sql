-- Active: 1687020775859@@127.0.0.1@3306
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS usuario (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    perm_usuario INTEGER NOT NULL DEFAULT(0),
    criador_id INTEGER NULL,
    criacao INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
    delecao INTEGER,
    FOREIGN KEY (criador_id) REFERENCES usuario(id)
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
CREATE TABLE IF NOT EXISTS pessoa (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    criador_id INTEGER NOT NULL,
    usuario_id INTEGER UNIQUE,
    --DUPLICADO DE USUARIO
    nome TEXT NOT NULL,
    email TEXT,
    --DOCUMENTOS
    cpf TEXT,
    cpnj TEXT,
    rg TEXT,
    --OUTROS
    apelido TEXT,
    endereco TEXT,
    cep TEXT,
    --MASCULINO OU FEMININO
    sexo TEXT,
    --DATA NASCIMENTO
    dn INTEGER,
    criacao INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
    delecao INTEGER,
    FOREIGN KEY (criador_id) REFERENCES usuario(id),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
) STRICT;
CREATE TABLE IF NOT EXISTS empresa (
    id INTEGER NOT NULL primary key autoincrement,
    dono_id INTEGER NOT NULL UNIQUE,
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
    FOREIGN KEY (dono_id) REFERENCES usuario(id)
) STRICT;
CREATE TABLE IF NOT EXISTS usuario_empresa(
    usuario_id INTEGER NOT NULL,
    empresa_id INTEGER NOT NULL,
    perm_empresa INTEGER NOT NULL DEFAULT(0),
    criacao INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
    delecao INTEGER,
    PRIMARY KEY (usuario_id, empresa_id),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    FOREIGN KEY (empresa_id) REFERENCES empresa(id)
) STRICT;