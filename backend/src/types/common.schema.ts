import { z } from "zod";

export const errorResponseSchema = z
  .object({
    error: z.string().meta({ example: "Usuário não encontrado" }),
    issues: z
      .array(z.unknown())
      .optional()
      .meta({
        description: "Zod validation issues, present on 400 responses.",
      }),
  })
  .meta({ id: "ErrorResponse" });

export type ErrorResponse = z.infer<typeof errorResponseSchema>;
