# Fragile-X backend — runs the Express API from source via tsx.
# Node 22 (package.json engines: >=22); Debian slim because Prisma needs OpenSSL.
FROM node:22-slim

# Prisma's query engine links against OpenSSL at runtime.
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
# Let corepack download the pnpm version pinned in package.json without prompting.
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

WORKDIR /app
RUN corepack enable

# Install all deps including dev: tsx, dotenv and the prisma CLI are needed at
# runtime/build, and NODE_ENV=production would otherwise prune them.
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod=false --frozen-lockfile

COPY . .

# Generate the Prisma client into src/generated. `prisma generate` reads the
# schema only — it never connects — so the placeholder DIRECT_URL just satisfies
# prisma.config.ts's required-var check. The real one is injected at runtime.
RUN DIRECT_URL="postgresql://placeholder:5432/db" pnpm db:generate

EXPOSE 3000
CMD ["pnpm", "start"]
