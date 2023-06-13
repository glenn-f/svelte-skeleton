PRAGMA foreign_keys = ON;
CREATE TABLE
    IF NOT EXISTS usuario (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS sessao (
        id TEXT PRIMARY KEY,
        usuario_id INTEGER NOT NULL,
        expiracao DATETIME NOT NULL,
        criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuario(id)
    );