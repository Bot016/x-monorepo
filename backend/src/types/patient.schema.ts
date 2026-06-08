import { z } from "zod";

export const createPatientSchema = z
  .object({
    name: z.string().min(1).meta({ example: "João da Silva" }),
    sex: z.enum(["m", "f"]).meta({ description: "'m' or 'f'." }),
    birthDate: z.iso.date().meta({ example: "2018-04-10" }),
    guardianId: z
      .uuid()
      .optional()
      .meta({ description: "Link to an existing guardian." }),
    guardian: z
      .object({
        name: z.string().min(1).meta({ example: "Maria Silva" }),
        cpf: z.string().length(11).optional().meta({ example: "12345678901" }),
        email: z.email().optional().meta({ example: "maria@example.com" }),
        phone: z.string().max(13).optional().meta({ example: "11987654321" }),
      })
      .optional()
      .meta({ description: "Create a new guardian inline." }),
  })
  .refine((d) => !(d.guardianId && d.guardian), {
    message: "Provide either guardianId or guardian, not both.",
  })
  .meta({ id: "CreatePatient" });

export const updatePatientSchema = z
  .object({
    name: z.string().min(1).meta({ example: "João da Silva" }),
    sex: z.enum(["m", "f"]),
    birthDate: z.iso.date().meta({ example: "2018-04-10" }),
    guardianId: z
      .uuid()
      .nullable()
      .meta({ description: "Set to null to unlink the guardian." }),
  })
  .partial()
  .meta({ id: "UpdatePatient" });

export const getPatientParamsSchema = z.object({
  id: z.uuid().meta({ description: "Patient id (UUID)." }),
});

export const guardianSummarySchema = z
  .object({
    id: z.uuid(),
    name: z.string().meta({ example: "Maria Silva" }),
    email: z.string().nullable(),
    phone: z.string().nullable(),
  })
  .meta({ id: "GuardianSummary" });

export const patientDtoSchema = z
  .object({
    id: z.uuid(),
    name: z.string().meta({ example: "João da Silva" }),
    sex: z.enum(["m", "f"]),
    birthDate: z
      .string()
      .meta({ example: "2018-04-10", description: "ISO date (YYYY-MM-DD)." }),
    guardianId: z.uuid().nullable(),
    guardian: guardianSummarySchema.nullable(),
  })
  .meta({ id: "Patient" });

export type CreatePatientParams = z.infer<typeof createPatientSchema>;
export type UpdatePatientParams = z.infer<typeof updatePatientSchema>;
export type GetPatientParams = z.infer<typeof getPatientParamsSchema>;
export type PatientDTO = z.infer<typeof patientDtoSchema>;
