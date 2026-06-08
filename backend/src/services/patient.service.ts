import type { Patient, PatientGuardian } from "../generated/prisma/index.js";
import { patientRepository } from "../repositories/patient.repository.js";
import { userRepository } from "../repositories/user.repository.js";
import type {
  CreatePatientParams,
  PatientDTO,
  UpdatePatientParams,
} from "../types/patient.schema.js";

type PatientWithGuardian = Patient & { guardian: PatientGuardian | null };

function toDto(p: PatientWithGuardian): PatientDTO {
  const birthDate =
    typeof p.birthDate === "string"
      ? p.birthDate
      : p.birthDate.toISOString().slice(0, 10);
  return {
    id: p.id,
    name: p.name,
    sex: p.sex,
    birthDate,
    guardianId: p.guardianId,
    guardian: p.guardian
      ? {
          id: p.guardian.id,
          name: p.guardian.name,
          email: p.guardian.email,
          phone: p.guardian.phone,
        }
      : null,
  };
}

export const patientService = {
  async list(userId: string): Promise<PatientDTO[]> {
    const isAdmin = !!(await userRepository.hasActiveRole(
      userId,
      "administrator",
    ));
    const rows = await patientRepository.findAll({ userId, isAdmin });
    return rows.map(toDto);
  },

  async getById(id: string): Promise<PatientDTO | null> {
    const row = await patientRepository.findById(id);
    return row ? toDto(row) : null;
  },

  async create(params: CreatePatientParams): Promise<PatientDTO> {
    const birthDate = new Date(params.birthDate);

    let row: PatientWithGuardian;
    if (params.guardian) {
      const { name, cpf, email, phone } = params.guardian;
      row = await patientRepository.createWithGuardian(
        { name: params.name, sex: params.sex, birthDate },
        {
          name,
          ...(cpf !== undefined && { cpf }),
          ...(email !== undefined && { email }),
          ...(phone !== undefined && { phone }),
        },
      );
    } else {
      row = await patientRepository.create({
        name: params.name,
        sex: params.sex,
        birthDate,
        ...(params.guardianId !== undefined && {
          guardianId: params.guardianId,
        }),
      });
    }
    return toDto(row);
  },

  async update(
    id: string,
    params: UpdatePatientParams,
  ): Promise<PatientDTO | null> {
    const existing = await patientRepository.findById(id);
    if (!existing) return null;

    const data: Parameters<typeof patientRepository.update>[1] = {};
    if (params.name !== undefined) data.name = params.name;
    if (params.sex !== undefined) data.sex = params.sex;
    if (params.birthDate !== undefined)
      data.birthDate = new Date(params.birthDate);
    if (params.guardianId !== undefined) data.guardianId = params.guardianId;

    const row = await patientRepository.update(id, data);
    return toDto(row);
  },

  async delete(id: string): Promise<PatientDTO | null> {
    const existing = await patientRepository.findById(id);
    if (!existing) return null;
    await patientRepository.softDelete(id);
    return toDto(existing);
  },
};
