# Backend — Triagem X Frágil

API em Node.js + TypeScript + Express, com Prisma (Postgres/Supabase) e Supabase Auth, utilizando a arquitetura MVC.

## Pré-requisitos

`.env` na raiz de `backend/` com:

```
DATABASE_URL=               # pooler de transação (porta 6543) — runtime
DIRECT_URL=                 # conexão direta (porta 5432) - migrations
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=  # secreta, só backend
PORT=3000
NODE_ENV=development
```

## Primeiros passos

```bash
cp .env.example .env   # 1. preencha com as credenciais do Supabase
pnpm install           # 2. instala as dependências
pnpm db:migrate        # 3. cria as tabelas no banco + roda o seed
pnpm dev               # 4. sobe o servidor (http://localhost:3000)
```

Para conferir, acesse `http://localhost:3000/health` — deve responder `OK`
(esse endpoint também testa a conexão com o banco).

## Comandos

```bash
pnpm dev            # servidor em watch (tsx)
pnpm build          # compila TypeScript para dist/
pnpm start          # roda o build de produção

pnpm db:migrate     # cria/aplica migrations + roda o seed
pnpm db:seed        # roda só o seed
pnpm db:studio      # GUI do banco
pnpm db:deploy      # aplica migrations sem prompt (CI/produção)

pnpm check:types    # checagem de tipos (tsc)
pnpm format         # formata o código com Prettier
pnpm format:check   # checa formatação sem alterar
```

## Estrutura

```
src/
  config/        env, prisma client, supabase client
  routes/        routers Express (um por recurso)
  controllers/   parse req → service → resposta
  services/      regras de negócio (score, relatórios)
  middleware/    auth, RBAC, validação, erros
  generated/     cliente Prisma gerado (não editar)
prisma/
  schema.prisma  modelos
  migrations/    histórico de migrations
  seed.ts        dados base (cargos, sintomas)
```
