# Format4You — Server (API de templates)

API que guarda os **estilos de cada template** de formatação (comandos,
estilos de texto e de parágrafo, margens) e os expõe por HTTP. A versão web
do Format4You já traz o template padrão embutido e roda sozinha; este servidor
é opcional e serve para quem quiser um sistema de **múltiplos templates**
editável.

## Stack

- Node.js + TypeScript (ESM)
- Express 5, Helmet, CORS
- Knex + SQLite (better-sqlite3)
- tsx (dev) e tsc (build)

## Rodando

Requer Node.js 20.19+.

```sh
cd server
npm install
cp .env.example .env     # Windows: copy .env.example .env
npm run db:setup         # cria as tabelas (migrate) e popula o template SBC (seed)
npm run dev              # http://localhost:3333
```

| Script | O que faz |
| --- | --- |
| `npm run dev` | Servidor com recarga automática |
| `npm run build` / `npm start` | Compila para `dist/` e executa |
| `npm run migrate` | Cria/atualiza as tabelas |
| `npm run seed` | Popula o template padrão (SBC) |
| `npm run db:setup` | Migrate + seed |
| `npm run typecheck` | Checagem de tipos |

O banco (`*.sqlite`) é gerado localmente e **não** é versionado — recrie com
`npm run db:setup`.

## Variáveis de ambiente

| Variável | Padrão | Descrição |
| --- | --- | --- |
| `PORT` | `3333` | Porta HTTP |
| `HOST` | `0.0.0.0` | Interface de rede |
| `CORS_ORIGIN` | `http://localhost:3000` | Origens liberadas (vírgula, ou `*`) |
| `DATABASE_PATH` | `src/database/database.sqlite` | Caminho do SQLite |

## Endpoints

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/health` | Health check |
| GET | `/template/commands?template=sbc` | Lista os comandos do template |
| GET | `/template/command/textstyle?template=sbc&command=%23title%3A` | Estilo de texto de um comando |
| GET | `/template/command/formatstyle?template=sbc&command=%23text%3A` | Formatação do parágrafo |
| GET | `/template/command/type?template=sbc&commandtype=image` | Comando associado a um tipo |
| GET | `/template/margins?template=sbc` | Margens do template |
| POST | `/template` | Cria um comando com seus estilos |
| POST | `/template/margins` | Cria as margens de um template |

Medidas em *twips* (1/20 pt); tamanho de fonte em meios-pontos (24 = 12pt),
compatível com a biblioteca `docx`.

## Estrutura

```
src/
  config/env.ts           variáveis de ambiente
  database/
    connection.ts         instância do Knex
    types.ts              tipos das tabelas
    migrations/           criação das tabelas
    seeds/                template SBC padrão
    migrate.ts|seed.ts    runners (npm run migrate|seed)
  controllers/            regras de cada rota
  routes.ts               mapeamento das rotas
  utils/asyncHandler.ts   captura de erros async
  app.ts                  app Express (helmet, cors, erro)
  server.ts               sobe o servidor
```
