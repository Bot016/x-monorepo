import { prisma } from "../config/prisma.js";
import type { Sex } from "../generated/prisma/index.js";

type GuardianCreateData = {
  name: string;
  cpf?: string;
  email?: string;
  phone?: string;
};

type PatientCreateData = {
  name: string;
  sex: Sex;
  birthDate: Date;
};

const withGuardian = { guardian: true } as const;

export const patientRepository = {
  findAll({ userId, isAdmin }: { userId: string; isAdmin: boolean }) {
    return prisma.patient.findMany({
      where: {
        deletedAt: null,
        ...(isAdmin
          ? {}
          : { assessments: { some: { userId, deletedAt: null } } }),
      },
      include: withGuardian,
      orderBy: { name: "asc" },
    });
  },

  findById(id: string) {
    return prisma.patient.findFirst({
      where: { id, deletedAt: null },
      include: withGuardian,
    });
  },

  create(data: PatientCreateData & { guardianId?: string }) {
    return prisma.patient.create({ data, include: withGuardian });
  },

  createWithGuardian(patient: PatientCreateData, guardian: GuardianCreateData) {
    return prisma.patient.create({
      data: { ...patient, guardian: { create: guardian } },
      include: withGuardian,
    });
  },

  update(
    id: string,
    data: Partial<PatientCreateData & { guardianId: string | null }>,
  ) {
    return prisma.patient.update({
      where: { id },
      data,
      include: withGuardian,
    });
  },

  softDelete(id: string) {
    return prisma.patient.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },
};
