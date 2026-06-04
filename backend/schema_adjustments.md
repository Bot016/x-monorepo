## 3. Schema adjustments

Below are the migrations to apply on top of the current schema. They turn each rule into data instead of hard-coded constants, fix one identity-column bug, and align the schema with Supabase Auth.

### 3.1 Replace `senha_hash` with link to `auth.users`

```sql
-- Migration: 001_auth_link
ALTER TABLE usuario DROP COLUMN senha_hash;
ALTER TABLE usuario
  ADD CONSTRAINT usuario_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Trigger: when a new auth user is created, mirror into public.usuario
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.usuario (id, nome, email)
  VALUES (NEW.id,
          COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email),
          NEW.email);
  RETURN NEW;
END $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();
```

`usuario.id` now equals `auth.users.id`. Backend never sees raw passwords.

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

### 3.7 Seed `cargo` and `sintoma`

```sql
-- Migration: 007_seed
INSERT INTO cargo (nome) VALUES ('administrador'), ('profissional_saude')
ON CONFLICT (nome) DO NOTHING;

-- sintoma rows: nome_sintoma, categoria, peso_m, peso_f, aplicavel_sexo
-- (12 symptoms — fill in the weights from the clinical protocol)
```

The full sintoma seed needs the calibrated weights from the clinical reference. Track this as a blocker for go-live.

### 3.8 RLS policies (defense in depth)

Even though Express enforces auth and the backend uses the service role, define policies so a leaked anon key can't read PII:

```sql
CREATE POLICY "deny anon" ON usuario FOR ALL TO anon USING (false);
-- Repeat for every table. Service role bypasses RLS automatically.
```
