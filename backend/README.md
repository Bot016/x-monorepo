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
pnpm db:generate       # 3. gera o cliente Prisma (o banco já está migrado)
pnpm dev               # 4. sobe o servidor (http://localhost:3000)
```

Para conferir, acesse `http://localhost:3000/health` — deve responder `OK`
(esse endpoint também testa a conexão com o banco).

## Documentação da API (OpenAPI)

A API expõe uma especificação **OpenAPI 3.1** gerada a partir dos mesmos
schemas Zod usados na validação em runtime — ou seja, os formatos de
request/response não saem do que o código realmente valida.

- **`GET /openapi.json`** — a especificação crua (consumível por geradores de
  cliente, Postman, etc.)
- **`GET /docs`** — Swagger UI interativo

> Ambos ficam **desabilitados em produção** (`NODE_ENV=production`) para não
> expor a superfície da API publicamente. Em dev/test respondem normalmente.

### Modelo mental

A spec **não** se sincroniza sozinha com os routers. Cada recurso mantém um
mapa escrito à mão (`*.docs.ts`) que liga `path → schema → status codes`. O
Zod garante que os **formatos dos dados** estejam corretos; **a lista de rotas
é responsabilidade sua** — se você adicionar uma rota e esquecer de documentá-la,
a spec simplesmente não a menciona (nada quebra, só fica incompleta).

| Arquivo       | Papel                                                                       |
| ------------- | --------------------------------------------------------------------------- |
| `*.schema.ts` | verdade sobre os **formatos de dados** (compartilhado por validação + docs) |
| `*.routes.ts` | verdade sobre o **comportamento** (o que realmente roda)                    |
| `*.docs.ts`   | mapa manual ligando rotas → schemas → status codes                          |
| `openapi.ts`  | índice que junta todos os mapas e define info + auth                        |

### Como documentar um novo domínio

Ao criar um recurso novo (ex.: `patients`), além de `patient.routes.ts` /
`patient.controller.ts` / `patient.service.ts`:

1. **Schemas** — em `types/patient.schema.ts`, marque cada schema com
   `.meta({ id: "Patient" })` (vira um schema nomeado na spec) e adicione
   `.meta({ example })` nos campos quando útil.
2. **Docs** — crie `routes/patient.docs.ts` exportando um
   `ZodOpenApiPathsObject` (espelhe `user.docs.ts`): para cada método+path,
   declare `requestParams`/`requestBody`/`responses` referenciando os schemas.
   Rotas que exigem `administrator` documentam um `403`.
3. **Registro** — em `openapi.ts`, dê spread no fragmento dentro de `paths`:
   ```ts
   paths: { ...userPaths, ...patientPaths }
   ```

Toda operação herda o `bearerAuth` global (token do Supabase em
`Authorization: Bearer <token>`). Para um endpoint público, sobrescreva com
`security: []` na operação.

Depois de mexer, confira com `pnpm check:types` e abra `/docs`.

## Comandos

```bash
pnpm dev            # servidor em watch (tsx)
pnpm build          # compila TypeScript para dist/
pnpm start          # roda o build de produção

pnpm db:generate    # gera o cliente Prisma a partir do schema
pnpm db:migrate     # cria uma migration nova (só em banco de dev — pode resetar!)
pnpm db:deploy      # aplica migrations pendentes sem prompt (banco compartilhado/CI)
pnpm db:seed        # roda o seed (idempotente)
pnpm db:studio      # GUI do banco

pnpm check:types    # checagem de tipos (tsc)
pnpm format         # formata o código com Prettier
pnpm format:check   # checa formatação sem alterar
```

## Estrutura

```
src/
  config/        env, prisma client, supabase client
  routes/        routers Express + docs OpenAPI (*.routes.ts / *.docs.ts)
  controllers/   parse req → service → resposta
  services/      regras de negócio (score, relatórios)
  middleware/    auth, RBAC, validação, erros
  types/         schemas Zod (validação + base da spec OpenAPI)
  generated/     cliente Prisma gerado (não editar)
  openapi.ts     monta o documento OpenAPI a partir dos fragmentos *.docs.ts
prisma/
  schema.prisma  modelos
  migrations/    histórico de migrations
  seed.ts        dados base (cargos, sintomas)
```
