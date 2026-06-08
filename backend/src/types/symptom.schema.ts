import { z } from "zod";

export const getSymptomParamsSchema = z.object({
  id: z.uuid().meta({ description: "ID do sintoma (UUID)", example: "123e4567-e89b-12d3-a456-426614174000" }),
});

export const getSymptomsQuerySchema = z.object({
  sex: z.enum(['m', 'f', '']).optional().meta({ 
    description: "Filtra e unifica os pesos dos sintomas com base no sexo ('m', 'f' ou vazio)", 
    example: "m" 
  }),
});

export const symptomResponseSchema = z.object({
  id: z.uuid().meta({ example: "550e8400-e29b-41d4-a716-446655440000" }),
  symptomName: z.string().meta({ example: "Delayed speech development" }),
  category: z.string().nullable().meta({ example: "cognitive" }),
  weight: z.number().or(z.string()).optional().meta({ example: 0.14 }),
  weightM: z.number().or(z.string()).optional().meta({ example: 0.14 }),
  weightF: z.number().or(z.string()).optional().nullable().meta({ example: 0.01 }),
}).meta({ id: "Symptom" });
