PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS usuario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    criacao INTEGER NOT NULL DEFAULT (unixepoch('subsec') * 1000)
) STRICT;
CREATE TABLE IF NOT EXISTS sessao (
    id TEXT PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    expiracao INTEGER NOT NULL,
    criacao INTEGER NOT NULL DEFAULT (unixepoch('subsec') * 1000),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
) STRICT;