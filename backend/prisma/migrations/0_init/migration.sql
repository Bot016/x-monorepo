-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('m', 'f');

-- CreateEnum
CREATE TYPE "UserRoleStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "ScreeningResult" AS ENUM ('suspected', 'low_risk');

-- CreateEnum
CREATE TYPE "SymptomCategory" AS ENUM ('behavioral', 'cognitive', 'physical');

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_role" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "role_id" INTEGER NOT NULL,
    "assigned_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "UserRoleStatus" NOT NULL DEFAULT 'active',

    CONSTRAINT "user_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_guardian" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "cpf" VARCHAR(11),
    "email" TEXT,
    "phone" VARCHAR(13),

    CONSTRAINT "patient_guardian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "guardian_id" UUID,
    "name" TEXT NOT NULL,
    "sex" "Sex" NOT NULL,
    "birth_date" DATE NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "score" DECIMAL(3,2),
    "screening_result" "ScreeningResult",
    "assessment_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applied_threshold" DECIMAL(4,3),
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "symptom" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "symptom_name" TEXT NOT NULL,
    "category" "SymptomCategory",
    "weight_m" DECIMAL(3,2),
    "weight_f" DECIMAL(3,2),
    "applicable_sex" "Sex",

    CONSTRAINT "symptom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_symptom" (
    "assessment_id" UUID NOT NULL,
    "symptom_id" UUID NOT NULL,
    "is_present" BOOLEAN NOT NULL,

    CONSTRAINT "assessment_symptom_pkey" PRIMARY KEY ("assessment_id","symptom_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "patient_guardian_cpf_key" ON "patient_guardian"("cpf");

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient" ADD CONSTRAINT "patient_guardian_id_fkey" FOREIGN KEY ("guardian_id") REFERENCES "patient_guardian"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment" ADD CONSTRAINT "assessment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment" ADD CONSTRAINT "assessment_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_symptom" ADD CONSTRAINT "assessment_symptom_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "assessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_symptom" ADD CONSTRAINT "assessment_symptom_symptom_id_fkey" FOREIGN KEY ("symptom_id") REFERENCES "symptom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

