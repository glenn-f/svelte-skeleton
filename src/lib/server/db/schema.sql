-- Active: 1687020775859@@127.0.0.1@3306
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS usuario (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    permUsuario INTEGER DEFAULT(0),
    criador_id INTEGER NULL,
    criacao INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
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
    OR REPLACE INTO usuario (id, nome, email, senha)
VALUES
    (
        0,
        'Administrador',
        'a@d.min',
        '$2b$10$kgAkctImz3V8beH8rUcp5eUxa8N4FUWrI4DQ2J30sePHSVmzNqj9C'
    );
--senha123
CREATE TABLE IF NOT EXISTS pessoa (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
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
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
) STRICT;
CREATE TABLE IF NOT EXISTS empresa (
    id INTEGER NOT NULL primary key autoincrement,
    dono_id INTEGER NOT NULL UNIQUE,
    FOREIGN KEY (dono_id) REFERENCES usuario(id)
) STRICT;
CREATE TABLE IF NOT EXISTS usuario_empresa(
    usuario_id INTEGER NOT NULL,
    empresa_id INTEGER NOT NULL,
    permEmpresa INTEGER NOT NULL DEFAULT(0),
    PRIMARY KEY (usuario_id, empresa_id),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    FOREIGN KEY (empresa_id) REFERENCES empresa(id)
) STRICT;

-- Inserir novo usuário na tabela "usuario"
INSERT INTO usuario (nome, email, senha, criador_id)
VALUES ('NomeAleatorio', 'email@aleatorio.com', 'senhaAleatoria', 0);

-- Obter o ID do usuário recém-criado
SELECT last_insert_rowid() AS novo_usuario_id;

--!Inserir uma pessoa relacionada ao usuário
INSERT INTO pessoa (nome, email, usuario_id)
SELECT u.nome, u.email, last_insert_rowid()
FROM usuario u
WHERE u.id = last_insert_rowid();
