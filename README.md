# Gerenciamento de Estoque com SvelteKit

Um sistema abrangente de gerenciamento de inventário e e-commerce construído com SvelteKit. Esta aplicação permite que empresas gerenciem seu inventário, processem vendas e recompras (buybacks), acompanhem transações financeiras e gerem relatórios.

## Funcionalidades

- Autenticação de usuários e gerenciamento de permissões
- Gerenciamento de inventário
- Processamento de vendas
- Acompanhamento de recompras
- Monitoramento de transações financeiras
- Geração de relatórios em PDF
- Gerenciamento de relacionamento com clientes e fornecedores
- Painel com análises

## Tecnologias

- **Frontend**: SvelteKit, Tailwind CSS, Skeleton UI
- **Backend**: Node.js, SvelteKit (SSR)
- **Banco de Dados**: SQLite (better-sqlite3)
- **Autenticação**: Autenticação personalizada baseada em sessões
- **Validação de Formulários**: Zod, sveltekit-superforms
- **Componentes UI**: @skeletonlabs/skeleton, @vincjo/datatables
- **Geração de PDF**: pdfmake
- **Gráficos**: Chart.js
- **Data/Hora**: Luxon
- **Testes**: Vitest, Playwright
- **Outras Ferramentas**: Vite, ESLint, Prettier

## Primeiros Passos

### Pré-requisitos

- Node.js (v18+)
- npm (atualmente pnpm e yarn conflitam com sqlite)

### Instalação

1. Clone o repositório:
```sh
git clone https://github.com/glenn-f/svelte-skeleton 
cd svelte_skeleton
```

2. Instale as dependências:
```sh
npm install
```

3. Crie um arquivo `.env` no diretório raiz (use `.env.example` como modelo):
```sh
cp .env.example .env
```

4. Inicialize o banco de dados (sqlite):
```sh
npm run db:refresh
```

### Desenvolvimento

Execute o servidor de desenvolvimento:
```sh
npm run dev
```

A aplicação estará disponível em `http://localhost:5173` (ou na porta especificada em sua configuração).

### Compilando para Produção

Compile a aplicação:
```sh
npm run build
```

### Executando em Produção

Inicie a aplicação em modo de produção:
```sh
npm start
```

## Outros Comandos

- **Visualizar build de produção**: `npm run preview`
- **Executar testes**: `npm run test`
- **Executar testes unitários**: `npm run test:unit`
- **Verificar código (lint)**: `npm run lint`
- **Formatar código**: `npm run format`
- **Resetar banco de dados**: `npm run db:refresh`

## Estrutura do Projeto

- `src` - Código fonte da aplicação
  - `/lib` - Bibliotecas e componentes compartilhados
    - `/server` - Código do lado do servidor
    - `/relatorios` - Geração de relatórios
    - `/zod` - Esquemas de validação
  - `/routes` - Rotas do SvelteKit
  - `static` - Ativos estáticos
- `tests` - Arquivos de teste
- `build` - Saída da compilação para produção
- `prisma` - Schema e migrações do Prisma

### Status do Projeto

O sistema atualmente está funcional, porém ainda incompleto. Algumas funcionalidades principais já estão implementadas e operacionais, mas há trabalho em andamento para expandir e aprimorar o sistema. 

- Atualizações de bibliotecas estão pendentes para garantir compatibilidade e segurança
- A finalização do escopo completo do projeto está em andamento
- Novos módulos estão sendo desenvolvidos conforme prioridades estabelecidas
- Otimizações de desempenho serão aplicadas após a conclusão das funcionalidades principais

Contribuidores são bem-vindos para ajudar a completar os aspectos pendentes do sistema.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

