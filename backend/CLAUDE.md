# Backend

## After every change

Always run both commands before considering a task done:

```bash
pnpm check:types   # must exit 0
pnpm format        # auto-fixes formatting (Prettier)
```

If `check:types` fails, fix the errors — do not skip or cast them away unless the cast is genuinely the right solution.

## Architecture

MVC with a strict service layer. The request flow is:

```
middleware (auth, validate) → controller → service → repository → Prisma
```

- **Controllers** — parse `req`, call one service method, send the response. No Prisma, no business logic.
- **Services** — all business rules live here. No `req`/`res`. Unit-testable without a DB.
- **Repositories** — reusable Prisma queries. Called only by services.
- **Middleware** — `requireAuth`, `requireAdmin`, `validate(schema, target)`.

## Adding a new resource

One file per layer, co-located by resource name:

```
src/types/<resource>.schema.ts      — Zod schemas + DTO types
src/repositories/<resource>.repository.ts
src/services/<resource>.service.ts
src/controllers/<resource>.controller.ts
src/routes/<resource>.routes.ts     — Express router
src/routes/<resource>.docs.ts       — OpenAPI path fragment
```

Register in `server.ts` (`app.use`) and `openapi.ts` (`paths: { ...resourcePaths }`).

## Code style

- Be minimal: change only what the task requires. Do not refactor surrounding code, add abstractions, or clean up unrelated areas.
- No comments unless the *why* is non-obvious (hidden constraint, workaround, subtle invariant).
- No `console.log` in production paths — errors surface through the global error handler in `server.ts`.
- Validation lives in Zod schemas (`types/<resource>.schema.ts`), not in controllers or services.
- Error responses always use `{ error: string }` — match the shape in `types/common.schema.ts`.

## OpenAPI docs

- Add `.meta({ id: "SchemaName" })` to every request/response Zod schema so it appears as a named `$ref` in the spec.
- Add `.meta({ example: ... })` on individual fields when it helps.
- Document every new route in the resource's `*.docs.ts` file. If you add a route and skip the docs, the spec silently omits it.
- The spec is served only in dev (`NODE_ENV !== "production"`): `/docs` (Swagger UI) and `/openapi.json`.

## Testing

- Unit-test services, not controllers or repositories.
- Mock both repositories the service depends on at the top of the test file with `vi.mock(...)`.
- Access `mock.calls[0]?.[0]` (with `?.`) — TypeScript requires it since the call may not have happened.
- Run tests with `pnpm test`.
