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

## Comandos

```bash
pnpm install        # instala dependências
pnpm dev            # sobe o servidor em watch (tsx)

pnpm db:migrate     # cria/aplica migrations + roda o seed
pnpm db:seed        # roda só o seed
pnpm db:studio      # GUI do banco
pnpm db:deploy      # aplica migrations sem prompt (CI/produção)
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
