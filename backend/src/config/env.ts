import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(3000),

  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1),

  SUPABASE_URL: z.url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  ALLOWED_ORIGINS: z.string().default(""),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `- ${i.path.join(".") || "(root)"}: ${i.message}`)
    .join("\n");
  throw new Error(`Invalid environment variables:\n${issues}`);
}

export const env = parsed.data;

export const allowedOrigins = env.ALLOWED_ORIGINS.split(",")
  .map((s) => s.trim())
  .filter(Boolean);
