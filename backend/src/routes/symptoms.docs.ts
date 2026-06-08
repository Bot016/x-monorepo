import type { ZodOpenApiPathsObject } from "zod-openapi";
import {
  symptomResponseSchema,
  getSymptomsQuerySchema,
} from "../types/symptom.schema.js";

export const symptomPaths: ZodOpenApiPathsObject = {
  "/symptoms": {
    get: {
      tags: ["Symptoms"], 
      summary: "Symptoms list", 
      description: "Returns the list of symptoms. If the query param `sex` is given ('m' ou 'f'), the `weight` property returns the unified weight, omitting `weightM` e `weightF`.",
      
      requestParams: { 
        query: getSymptomsQuerySchema 
      },
      responses: {
        "200": {
          description: "Lista de sintomas recuperada com sucesso",
          content: {
            "application/json": { schema: symptomResponseSchema.array() },
          },
        },
        "400": { 
          description: "Parâmetro sex inválido" 
        },
      },
    },
  }
};