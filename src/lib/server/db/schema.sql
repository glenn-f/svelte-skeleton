-- Active: 1687020775859@@127.0.0.1@3306
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS usuario (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    criacao INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
) STRICT;
CREATE TABLE IF NOT EXISTS sessao (
    id TEXT NOT NULL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    expiracao INTEGER NOT NULL,
    criacao INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
) STRICT;

INSERT OR REPLACE INTO
    usuario (id, nome, email, senha)
VALUES
    (0,'Administrador','a@d.min','$2b$10$kgAkctImz3V8beH8rUcp5eUxa8N4FUWrI4DQ2J30sePHSVmzNqj9C'); --senha123

