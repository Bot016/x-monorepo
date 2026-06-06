import { z } from "zod";
import type { Symptom } from "../generated/prisma/index.js";

export const createSymptomSchema = z.object({
  symptomName: z.string().min(1),

  category: z.string(), 

  weightM: z.number(),
  weightF: z.number(),

  applicable_sex: z.string(),
});

export const getSymptomParamsSchema = z.object({
  id: z.uuid(),
});

export type createSymptomInput = z.infer<typeof createSymptomSchema>;

export type SymptomDTO = Symptom;
export type GetSymptomParams = z.infer<typeof getSymptomParamsSchema>;
