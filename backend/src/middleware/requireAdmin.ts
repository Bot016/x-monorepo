import type { Request, Response, NextFunction } from "express";
import { userRepository } from "../repositories/user.repository.js";

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const isAdmin = await userRepository.hasActiveRole(
    req.user.id,
    "administrator",
  );
  if (!isAdmin) {
    return res.status(403).json({ error: "Not authorized" });
  }
  next();
}
