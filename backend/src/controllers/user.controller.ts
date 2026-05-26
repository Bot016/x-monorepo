import type { Request, Response } from "express";
import { userService } from "../services/user.service.js";
import type { GetUserParams } from "../types/user.schema.js";

export const userController = {
  async getById(req: Request<GetUserParams>, res: Response) {
    const user = await userService.getById(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json(user);
  },
};
