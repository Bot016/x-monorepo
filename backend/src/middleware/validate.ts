import type { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

type Target = "body" | "query" | "params";

export function validate(schema: ZodType, target: Target = "body") {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      return res.status(400).json({
        error: "Dados inválidos",
        issues: result.error.issues,
      });
    }
    req[target] = result.data;
    next();
  };
}
