import type { Request, Response, NextFunction } from "express";
import { supabaseAdmin } from "../config/supabase.js";
import { userRepository } from "../repositories/user.repository.js";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token de acesso ausente" });
  }

  const token = header.slice("Bearer ".length);
  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }

  const profile = await userRepository.findById(data.user.id);
  if (!profile) {
    return res.status(401).json({ error: "Conta inativa ou inexistente" });
  }

  req.user = { id: data.user.id };
  next();
}
