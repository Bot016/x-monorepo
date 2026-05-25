-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('m', 'f');

-- CreateEnum
CREATE TYPE "StatusUsuarioCargo" AS ENUM ('ativo', 'inativo');

-- CreateEnum
CREATE TYPE "ResultadoTriagem" AS ENUM ('suspeito', 'baixo_risco');

-- CreateEnum
CREATE TYPE "CategoriaSintoma" AS ENUM ('comportamental', 'cognitivo', 'fisico');

-- CreateTable
CREATE TABLE "usuario" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletado_em" TIMESTAMPTZ,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cargo" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "cargo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario_cargo" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_usuario" UUID NOT NULL,
    "id_cargo" INTEGER NOT NULL,
    "data_atribuicao" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "StatusUsuarioCargo" NOT NULL DEFAULT 'ativo',

    CONSTRAINT "usuario_cargo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responsavel_paciente" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nome" TEXT NOT NULL,
    "cpf" VARCHAR(11),
    "email" TEXT,
    "telefone" VARCHAR(13),

    CONSTRAINT "responsavel_paciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paciente" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_responsavel" UUID,
    "nome" TEXT NOT NULL,
    "sexo" "Sexo" NOT NULL,
    "data_nascimento" DATE NOT NULL,
    "deletado_em" TIMESTAMPTZ,

    CONSTRAINT "paciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avaliacao" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_usuario" UUID NOT NULL,
    "id_paciente" UUID NOT NULL,
    "score" DECIMAL(3,2),
    "resultado_triagem" "ResultadoTriagem",
    "data_avaliacao" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "threshold_aplicado" DECIMAL(4,3),
    "deletado_em" TIMESTAMPTZ,

    CONSTRAINT "avaliacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sintoma" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nome_sintoma" TEXT NOT NULL,
    "categoria" "CategoriaSintoma",
    "peso_m" DECIMAL(3,2),
    "peso_f" DECIMAL(3,2),
    "aplicavel_sexo" "Sexo",

    CONSTRAINT "sintoma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avaliacao_sintoma" (
    "id_avaliacao" UUID NOT NULL,
    "id_sintoma" UUID NOT NULL,

    CONSTRAINT "avaliacao_sintoma_pkey" PRIMARY KEY ("id_avaliacao","id_sintoma")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "cargo_nome_key" ON "cargo"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "responsavel_paciente_cpf_key" ON "responsavel_paciente"("cpf");

-- AddForeignKey
ALTER TABLE "usuario_cargo" ADD CONSTRAINT "usuario_cargo_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_cargo" ADD CONSTRAINT "usuario_cargo_id_cargo_fkey" FOREIGN KEY ("id_cargo") REFERENCES "cargo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paciente" ADD CONSTRAINT "paciente_id_responsavel_fkey" FOREIGN KEY ("id_responsavel") REFERENCES "responsavel_paciente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacao" ADD CONSTRAINT "avaliacao_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacao" ADD CONSTRAINT "avaliacao_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacao_sintoma" ADD CONSTRAINT "avaliacao_sintoma_id_avaliacao_fkey" FOREIGN KEY ("id_avaliacao") REFERENCES "avaliacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacao_sintoma" ADD CONSTRAINT "avaliacao_sintoma_id_sintoma_fkey" FOREIGN KEY ("id_sintoma") REFERENCES "sintoma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
