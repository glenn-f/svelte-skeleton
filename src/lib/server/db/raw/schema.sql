-- Active: 1687020775859@@127.0.0.1@3306

PRAGMA foreign_keys = ON;

CREATE TABLE
    IF NOT EXISTS usuario (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL,
        senha TEXT NOT NULL,
        tipo_usuario INTEGER NOT NULL DEFAULT(0),
        criador_id INTEGER NULL,
        criacao INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
        delecao INTEGER,
        FOREIGN KEY (criador_id) REFERENCES usuario(id),
        UNIQUE (email)
    ) STRICT;

CREATE TABLE
    IF NOT EXISTS sessao (
        id TEXT NOT NULL PRIMARY KEY,
        usuario_id INTEGER NOT NULL,
        expiracao INTEGER NOT NULL,
        criacao INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
        FOREIGN KEY (usuario_id) REFERENCES usuario(id)
    ) STRICT;

INSERT OR
REPLACE
    INTO usuario (
        id,
        nome,
        email,
        senha,
        tipo_usuario
    )
VALUES (
        0,
        'Administrador',
        'a@d.min',
        '$2b$10$kgAkctImz3V8beH8rUcp5eUxa8N4FUWrI4DQ2J30sePHSVmzNqj9C',
        99
    );

--senha123

CREATE TABLE
    IF NOT EXISTS empresa (
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

CREATE TABLE
    IF NOT EXISTS pessoa (
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

CREATE TABLE
    IF NOT EXISTS grupo_permissao_empresa (
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

CREATE TABLE
    IF NOT EXISTS usuario_empresa(
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

CREATE TABLE
    IF NOT EXISTS produto_categoria(
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        empresa_id INTEGER NOT NULL,
        nome TEXT NOT NULL,
        criacao INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
        delecao INTEGER,
        FOREIGN KEY (empresa_id) REFERENCES empresa(id),
        UNIQUE (nome)
    );

CREATE TABLE
    IF NOT EXISTS produto (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        empresa_id INTEGER NOT NULL,
        produto_categoria_id INTEGER,
        nome TEXT NOT NULL,
        criacao INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
        delecao INTEGER,
        FOREIGN KEY (empresa_id) REFERENCES empresa(id),
        FOREIGN KEY (produto_categoria_id) REFERENCES produto_categoria(id),
        UNIQUE (nome)
    );

CREATE TABLE
    IF NOT EXISTS estoque_entrada(
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        estoque_id INTEGER NOT NULL,
        qntd INTEGER NOT NULL,
        custo_estoque DECIMAL(14, 4) NOT NULL, -- unico - custo bruto especifico deste estoque (sem considerar custos globais da compra): valor do estoque, seguro do estoque, tributos sobre a compra ou custo de importacao)
        custo_compra_proporcional DECIMAL(14, 4) NOT NULL,-- copiado?/transferido? - taxas e tarifas globais de compra (proporcional a participação deste estoque no custo total de estoques da compra):
        -- frete, seguros e outros, anotado em tabela de taxas de compra) ou custo_compra (parcela)
        --credito_tributario DECIMAL(14, 4) NOT NULL,
        --credito_cashback DECIMAL(14, 4) NOT NULL,
        FOREIGN KEY (estoque_id) REFERENCES estoque(id)
    );

CREATE TABLE
    IF NOT EXISTS estoque(-- pode haver divisão de estoque (estoque_divisao), mantendo os mesmos valores, dividindo quantidade e em seguida, o custo proporcional, se for divisivel**
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        produto_id INTEGER NOT NULL,
        qntd INTEGER NOT NULL, -- transferivel, quantidade deste estoque (no estado atual: em avaliacao, disponivel)
        custo_total DECIMAL(14, 4) NOT NULL, -- transferivel,  custo bruto Acumulado do estoque (total custo_manutencao + total custo_entrada) 
        -- o custo de entrada inicialmente vem de uma linha da tabela estoque_entrada (custo_estoque + custo_compra_proporcional)
        -- o custo de manutencao é o acumulado do custo de manutenção aplicadas a este estoque (varias linhas de estoque_manutencao)
        preco_unitario DECIMAL(14, 4), --atualizavel
        estado INTEGER NOT NULL DEFAULT 1, --atualizavel (disponivel para em avaliacao)
        condicao INTEGER NOT NULL DEFAULT 1, --atualizavel: novo para semi novo? *somente em caso de erro*
        origem INTEGER NOT NULL DEFAULT 1, --atualizavel: nacional para local? *somente em caso de erro*
        codigo_unico TEXT,--*somente em caso de erro*
        outros_dados_json TEXT,--*somente em caso de erro ou inclusao de mais dados*
        observacoes TEXT,
        FOREIGN KEY (produto_id) REFERENCES produto(id)
    );

CREATE TABLE
    IF NOT EXISTS estoque_saida(
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        estoque_id INTEGER NOT NULL,
        qntd INTEGER NOT NULL, -- (transferido de estoque)
        receita DECIMAL(14, 4) NOT NULL, -- unico - preço_final_unitario * qntd (preço negociado por unidade * quantidade vendida)
        diferenca_preco DECIMAL(14, 4) NOT NULL DEFAULT 0, -- preço_final - preço >> desconto ou acréscimo feito no preço inicial do estoque (total)
        custo_comissao DECIMAL(14, 4) NOT NULL DEFAULT 0,-- acumulado (percentual da receita total do estoque, de acordo com regra de comissao deste estoque)
        -- tabela estoque_comissao (valor_comissao)
        custo_estoque_proporcional DECIMAL(14, 4) NOT NULL, -- transferido de estoque (custo_total), proporcional a  estoque_saida (qntd) )
        -- tabela estoque (custo total)
        custo_venda_proporcional DECIMAL(14, 4) NOT NULL DEFAULT 0, -- copiado proporcional - taxas e tarifas globais de venda (proporcional a participação deste estoque na receita total de estoques da venda):
        -- frete, brindes, encargos, comissao global, etc
        -- tabelas: (venda_taxas)
        --custo_tributario DECIMAL(14, 4) NOT NULL,
        --credito_cashback DECIMAL(14, 4) NOT NULL,
        FOREIGN KEY (estoque_id) REFERENCES estoque(id)
    );

CREATE TABLE
    IF NOT EXISTS conta (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        empresa_id INTEGER NOT NULL,
        nome TEXT NOT NULL,
        criacao INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
        delecao INTEGER,
        FOREIGN KEY (empresa_id) REFERENCES empresa(id),
        FOREIGN KEY (produto_categoria_id) REFERENCES produto_categoria(id),
        UNIQUE (nome)
    );