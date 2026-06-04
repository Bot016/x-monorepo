# Backend Specification — Checklist Clínico para Triagem Populacional (Síndrome do X Frágil)

Status: draft v1
Stack: Node.js 20+, TypeScript, Express 5, Prisma, Supabase (Postgres + Auth), pdfkit
Architecture: MVC (Model–View–Controller), service layer for business rules

---

## 1. Goals & scope

A single backend that serves both the React Native / Expo mobile app and the web app. Responsibilities:

- Authenticate health professionals and administrators (via Supabase Auth).
- Manage patients, guardians (`responsavel_paciente`), and evaluation history.
- Run the Fragile-X scoring rule server-side (the single source of truth for RN01–RN06).
- Produce filterable reports and printable PDFs (RF08).
- Stay LGPD-compliant (RNF04).

Out of scope for this spec: the front-end, the offline-first sync UX, push notifications.

---

## 2. Architecture

### 2.1 Layered MVC

```
backend/
  prisma/
    schema.prisma
    migrations/
    seed.ts
  src/
    config/           env, prisma client, supabase client
    routes/           express routers (one per resource)
    controllers/      thin: validate → call service → format response
    services/         business rules (scoring, reporting, RBAC checks)
    middleware/       auth, role guard, error handler, request validation, request id
    repositories/     prisma access helpers when a query is reused across services
    utils/            hashing helpers (not for passwords — Supabase Auth handles those), date helpers, pdf
    types/            shared TS types (DTOs, domain enums)
    tests/
    server.ts         app bootstrap
```

The `View` part of MVC here is the JSON response shape — the front-ends are the real "view." Reports rendered as PDF are the only server-rendered view.

### 2.2 Request flow

`Request → middleware (request-id, auth, role guard, zod validate) → controller → service → repository / prisma → service → controller → response`

Controllers never touch Prisma directly. Services never read `req`/`res`. This is what keeps scoring & reporting unit-testable.

### 2.3 Two Postgres clients

- **Prisma** (with `DATABASE_URL` pointing at the Supabase **service-role** pooled connection) — used for all data reads/writes. RLS is bypassed by the service role; access control is enforced in Express middleware (Q2 decision).
- **`@supabase/supabase-js`** (with `SUPABASE_SERVICE_ROLE_KEY`) — used only to (a) verify incoming user access tokens, and (b) create/disable users in `auth.users` when an admin invites a professional.

---

## 3. Schema adjustments

Below are the migrations to apply on top of the current schema. They turn each rule into data instead of hard-coded constants, fix one identity-column bug, and align the schema with Supabase Auth.

> **Naming convention (implemented).** The Prisma schema and live database use **English identifiers**, not the Portuguese names this spec was originally drafted with. The mapping: `usuario` → `user`, `cargo` → `role`, `usuario_cargo` → `user_role`, `sintoma` → `symptom`, `avaliacao` → `assessment`, `responsavel_paciente` → guardian table. Columns are camelCase in Prisma, snake_case in Postgres via `@map` (e.g. `created_at`, `deleted_at`). Role status values are `active` / `inactive` (not `ativo`). Treat the SQL blocks below as illustrative of intent; the authoritative identifiers are English (see `prisma/schema.prisma`).

### 3.1 Replace password column with link to `auth.users` — ✅ applied & live

The live trigger (verified against the running Supabase project) reads the **`name`** metadata key and writes the English `public.user` table:

```sql
-- public.user.id is a FK to auth.users(id) ON DELETE CASCADE.

-- Trigger: when a new auth user is created, mirror into public.user
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  INSERT INTO public."user" (id, name, email)
  VALUES (NEW.id,
          COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
          NEW.email);
  RETURN NEW;
END $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();
```

`user.id` now equals `auth.users.id`. Backend never sees raw passwords.

> **Important for the invite flow:** the trigger keys off `raw_user_meta_data->>'name'`. Any code that creates an auth user must pass the display name under the `name` metadata key (`{ data: { name } }`), or the user's name silently falls back to their email.

### 3.2 Data-driven sex restriction on symptoms

```sql
-- Migration: 002_sintoma_sex
ALTER TABLE sintoma
  ADD COLUMN aplicavel_sexo text CHECK (aplicavel_sexo IN ('m','f')) DEFAULT NULL;
-- NULL = applies to both. 'm' = males only (macroorquidismo).
```

RN02 / RF05 now live in data, not in code.

### 3.3 Fix `numero_sessao`

```sql
-- Migration: 003_numero_sessao
ALTER TABLE avaliacao DROP COLUMN numero_sessao;
-- We compute the session number per patient at read time using ROW_NUMBER()
-- in a view, or simply as part of the GET /evaluations response.
```

The original `GENERATED ALWAYS AS IDENTITY` produces a global counter across patients, which is almost certainly not what was intended.

### 3.4 Soften the threshold check

```sql
-- Migration: 004_threshold
ALTER TABLE avaliacao DROP CONSTRAINT avaliacao_threshold_aplicado_check;
ALTER TABLE avaliacao
  ALTER COLUMN threshold_aplicado TYPE numeric(4,3);
```

So future calibrations don't require a migration. Application-level validation still constrains the value.

### 3.5 Clean up `avaliacao_sintoma`

```sql
-- Migration: 005_join_table
ALTER TABLE avaliacao_sintoma DROP COLUMN deletado_em;
-- Soft-delete the parent avaliacao instead.
```

### 3.6 LGPD-friendly CPF

```sql
-- Migration: 006_cpf
ALTER TABLE responsavel_paciente
  ALTER COLUMN CPF TYPE varchar(11),
  ADD CONSTRAINT responsavel_paciente_cpf_unique UNIQUE (CPF);
-- Storage stays as plain CPF for now (required for clinical record lookup),
-- but access is gated by RBAC and the column is excluded from default list responses.
```

### 3.7 Seed `role` and `symptom` — ✅ applied & live

Seeded via `prisma/seed.ts` (`npm run db:seed`, idempotent). The live `role` table contains:

| id  | name                      |
| --- | ------------------------- |
| 1   | `administrator`           |
| 2   | `healthcare_professional` |

These English names are authoritative — `requireAdmin` checks for the active `administrator` role, and the invite flow resolves the request's role by this `name`. The 12 `symptom` rows are also seeded with calibrated `weightM` / `weightF` from the clinical protocol.

### 3.8 RLS policies (defense in depth)

Even though Express enforces auth and the backend uses the service role, define policies so a leaked anon key can't read PII:

```sql
CREATE POLICY "deny anon" ON usuario FOR ALL TO anon USING (false);
-- Repeat for every table. Service role bypasses RLS automatically.
```

---

## 4. Authentication & RBAC

### 4.1 Login

- The front-ends call `supabase.auth.signInWithPassword()` directly against Supabase and receive an access token + refresh token.
- The backend exposes **no `/auth/login` endpoint**; auth is fully delegated to Supabase.
- The front-ends send `Authorization: Bearer <access_token>` on every API request to this backend.

### 4.2 `requireAuth` middleware

```
1. Parse Bearer token.
2. Call supabase.auth.getUser(token) → returns auth user or 401.
3. Attach { user: { id } } to req.
```

> **As implemented:** `requireAuth` currently attaches only `{ id }` from the verified token; it does not pre-load the `user` row or roles. Role checks are a separate DB query in `requireAdmin` (see §4.3). The richer design below (loading `deleted_at`/roles into `req`) remains a possible future optimization.

Caching the token-verification result in-memory for the token's lifetime (the JWT carries `exp`) avoids hitting Supabase on every request — a follow-up optimization.

### 4.3 `requireAdmin` middleware

Runs **after** `requireAuth`, so the user id always comes from the verified token (`req.user.id`), never the URL/body. It checks for an **active** `administrator` role via a `user_role` lookup (`status = 'active'`). Used on admin-only routes (`GET /users`, `POST /users`, `PATCH /users/:id`).

### 4.4 Admin invites a professional

`POST /users` (admin only):

1. Service calls `supabase.auth.admin.inviteUserByEmail(email, { data: { name } })` — note the `name` metadata key (§3.1).
2. Trigger from §3.1 inserts the `public.user` row.
3. Service resolves the role by `name`, then inserts a `user_role` (status `active`).

A single user can hold multiple roles; the spec defines an admin as "has the `administrator` role active." Multiple active roles are allowed.

> **Bootstrap (chicken-and-egg):** the invite flow requires an existing admin, but the only in-app way to create users is this admin-only endpoint. The **first** `administrator` must be created out-of-band: create the auth user (Supabase dashboard → Authentication → Add user, or sign-up), then insert its `user_role` grant directly.

---

## 5. Domain logic — scoring service

`services/scoring.service.ts` is the only place the rule lives. It is pure (no I/O) so it's trivially unit-testable.

```ts
type Sexo = "m" | "f";

type SymptomInput = {
  id: string; // sintoma.id
  presente: boolean; // RF03: front-end sends booleans, no free text
};

type ScoringResult = {
  score: number; // sum of applicable weights
  thresholdAplicado: number; // 0.56 for 'm', 0.55 for 'f'
  resultado: "suspeito" | "baixo_risco";
  sintomasAplicados: string[]; // ids that were counted
  sintomasIgnorados: string[]; // ids skipped because of sex restriction
};

function calcularScore(
  sexo: Sexo,
  respostas: SymptomInput[],
  catalogoSintomas: Sintoma[], // includes aplicavel_sexo + peso_m + peso_f
): ScoringResult;
```

Rules implemented:

- **RN01 / RN05**: select `peso_m` or `peso_f` based on patient `sexo`.
- **RN02 / RF05**: skip any symptom whose `aplicavel_sexo` is set and doesn't match.
- **RN03**: validate the number of incoming symptoms equals the catalog count for that sex (11 for f, 12 for m); reject otherwise.
- **RN04**: `score = Σ peso · presente`.
- **RN06**: threshold = `sexo === 'm' ? 0.56 : 0.55`; `resultado = score > threshold ? 'suspeito' : 'baixo_risco'`.
- **RNF05**: this function must return in <100ms; the 3-second budget is for the whole request.

`POST /evaluations` is the only caller in production; tests call it directly.

---

## 6. API surface

All paths are under `/api/v1`. JSON in, JSON out, UTF-8. Errors follow §8.

### 6.1 Users (administrators only, except `GET /users/me`)

| Method | Path       | Role  | Description                                  |
| ------ | ---------- | ----- | -------------------------------------------- |
| GET    | /users/me  | any   | Current user + active roles                  |
| GET    | /users     | admin | List professionals                           |
| POST   | /users     | admin | Invite professional (`{name,email,role}`)    |
| PATCH  | /users/:id | admin | Edit name / roles (roles = replace-full-set) |
| DELETE | /users/:id | admin | Soft-delete (`deleted_at = now()`)           |

`PATCH /users/:id` uses **replace-full-set** semantics for roles: the body's `roles` array is the complete desired set of active roles. The service activates those and deactivates any others; `roles: []` clears all roles. `name` and `roles` are both optional (edit either). Unknown role names are rejected.

### 6.2 Patients

| Method | Path          | Role | Description                                    |
| ------ | ------------- | ---- | ---------------------------------------------- |
| POST   | /patients     | any  | Create patient (+ optional responsavel inline) |
| GET    | /patients     | any  | List own-evaluated patients; admin sees all    |
| GET    | /patients/:id | any  | Read                                           |
| PATCH  | /patients/:id | any  | Edit (RF02)                                    |
| DELETE | /patients/:id | any  | Soft-delete (RF02)                             |

### 6.3 Guardians (`responsavel_paciente`)

| Method | Path           | Role | Description |
| ------ | -------------- | ---- | ----------- |
| POST   | /guardians     | any  | Create      |
| GET    | /guardians/:id | any  | Read        |
| PATCH  | /guardians/:id | any  | Edit        |

CPF is included in single-resource reads but omitted from list responses.

### 6.4 Symptoms

| Method | Path      | Role | Description                                  |
| ------ | --------- | ---- | -------------------------------------------- |
| GET    | /symptoms | any  | Returns the catalog filtered by `?sexo=m\|f` |

### 6.5 Evaluations

| Method | Path             | Role            | Description                                                               |
| ------ | ---------------- | --------------- | ------------------------------------------------------------------------- |
| POST   | /evaluations     | any             | Create — runs `calcularScore`, persists `avaliacao` + `avaliacao_sintoma` |
| GET    | /evaluations     | own / admin all | Filter by patient, date range, resultado (RF06)                           |
| GET    | /evaluations/:id | own / admin     | Detailed view including per-symptom presença                              |

`POST /evaluations` payload:

```json
{
  "patientId": "uuid",
  "sintomas": [{ "id": "uuid", "presente": true }, ...]
}
```

The backend chooses `threshold_aplicado` from the patient's sex; the client doesn't send it.

### 6.6 Reports

| Method | Path         | Role            | Description                                         |
| ------ | ------------ | --------------- | --------------------------------------------------- |
| GET    | /reports     | own / admin all | Aggregated metrics, JSON (counts by suspeito/baixo) |
| GET    | /reports.pdf | own / admin all | Same filters, returns PDF (RF08)                    |

Supported query params (RF06 + minimundo):

- `sexo=m|f`
- `idadeMin`, `idadeMax`
- `resultado=suspeito|baixo_risco`
- `dataInicio`, `dataFim` (ISO date)
- `periodo=ultima_semana|ultimo_mes|ultimo_ano` (shorthand)
- `sintomas[]=uuid` (incidence filter)
- `profissionalId=uuid` (admin only — 403 otherwise)

Response shape (JSON):

```json
{
  "filtros": { ... echo of applied filters ... },
  "totais": { "suspeito": 12, "baixo_risco": 80, "total": 92 },
  "porSexo": { "m": {...}, "f": {...} },
  "incidenciaSintomas": [{ "sintomaId": "...", "nome": "...", "ocorrencias": 47 }],
  "porPeriodo": [{ "bucket": "2026-05", "suspeito": 3, "baixo_risco": 17 }]
}
```

---

## 7. Validation

Every endpoint that takes input gets a `zod` schema in `routes/<resource>.routes.ts`. A `validate(schema)` middleware parses `req.body | req.query | req.params` into typed values and rejects with 400 on failure.

Key schemas:

- `createPatientSchema` — name min 1, sexo enum, dataNascimento date, responsavelId optional uuid.
- `createEvaluationSchema` — patientId uuid, sintomas array exactly the expected length (the service re-checks against the catalog).
- `reportFilterSchema` — coerces query strings into dates / numbers / enums.

---

## 8. Errors & response envelope

Success: bare resource or list. No envelope, to keep responses lean.
Error envelope (always):

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [...] } }
```

Codes used: `VALIDATION_ERROR` (400), `UNAUTHENTICATED` (401), `FORBIDDEN` (403), `NOT_FOUND` (404), `CONFLICT` (409), `RATE_LIMITED` (429), `INTERNAL` (500).

A central `errorHandler` middleware maps thrown `AppError` subclasses to status + code. Prisma errors are translated (e.g. `P2002` → 409).

Each response carries `x-request-id` for log correlation.

---

## 9. Security & LGPD (RNF04)

- TLS terminated at the platform (Supabase / Vercel / Fly). HSTS on.
- `helmet()` default headers; `cors({ origin: ALLOWED_ORIGINS })`.
- `express-rate-limit`: 100 req/min per IP on `/api/*`, 10 req/min on auth-sensitive admin routes.
- All bodies validated by Zod; we never echo unknown fields.
- Logs use pino with a redaction list: `Authorization`, `password`, `cpf`, `email`, `senha`.
- Soft-delete (`deletado_em`) on `usuario`, `paciente`, `avaliacao`. A nightly job (out of scope of this spec) anonymizes records past retention.
- CPF returned only on single-resource reads, never in lists or reports.
- Admin actions (`POST /users`, role changes, deletes) are written to an `audit_log` table — add as a follow-up migration before go-live.

---

## 10. PDF reports

`services/pdf.service.ts` uses `pdfkit` to stream a PDF. Layout:

- Header: project name, generation date, professional name (or "admin").
- Filters applied (echoed from the query).
- Summary numbers (`totais`).
- Tables for `porSexo`, `incidenciaSintomas`, `porPeriodo`.
- Footer: page numbers, hash of the report content for traceability.

`GET /reports.pdf` sets `Content-Type: application/pdf` and streams. The same `reportingService.aggregate(filters)` produces both the JSON response and the input to the PDF renderer.

---

## 11. Dependencies to add

Runtime:

```
pnpm add prisma @prisma/client @supabase/supabase-js zod pino pino-http
pnpm add helmet cors express-rate-limit
pnpm add pdfkit
pnpm add dotenv
```

Dev:

```
pnpm add -D vitest supertest @types/supertest @types/pdfkit
pnpm add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
pnpm add -D prettier
```

`package.json` scripts to add: `db:migrate`, `db:seed`, `db:studio`, `test`, `test:watch`, `lint`, `format`.

---

## 12. Environment variables

```
DATABASE_URL=                 # Supabase pooled connection (service role)
DIRECT_URL=                   # Supabase direct connection (migrations)
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=    # backend only — never expose to clients
SUPABASE_JWT_SECRET=          # to verify tokens offline (optional perf optimization)
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:8081,https://app.example.com
LOG_LEVEL=info
```

`.env.example` committed; `.env` git-ignored.

---

## 13. Testing strategy

- **Unit**: `scoring.service` (table-driven tests covering RN01–RN06, macroorquidismo skip, threshold edges at exactly 0.55/0.56).
- **Unit**: `reporting.service` aggregation logic with seeded fixtures.
- **Integration**: route-level tests with supertest against a Postgres test schema (Supabase local or Docker-postgres). Auth is mocked at the middleware boundary — we don't hit real Supabase in tests.
- **Contract**: a small set of golden-response fixtures for `/reports` to catch accidental shape changes.

CI runs `pnpm lint && pnpm test && pnpm build`.

---

## 14. Open items / follow-ups (not blocking this spec)

1. Calibrated `peso_m` / `peso_f` values for the 12 sintomas — needs clinical source.
2. Offline sync protocol for the Expo app (idempotency keys on `POST /evaluations`).
3. `audit_log` table + middleware for admin actions.
4. Retention / anonymization policy details for LGPD.
5. Family history field (`RN07`) — the current schema has nowhere to record it; needs a dedicated table or a JSONB column on `paciente`.
