import type { Request, Response } from "express";
import { userService } from "../services/user.service.js";
import type { GetUserParams } from "../types/user.schema.js";

export const userController = {
  async getById(req: Request<GetUserParams>, res: Response) {
    const user = await userService.getById(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json(user);
  },

  async getMe(req: Request, res: Response) {
    const user = await userService.getById(req.user!.id);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json(user);
  },

  async getUsers(_: Request, res: Response) {
    const users = await userService.getUsers();
    res.json(users);
  },

  async invite(req: Request, res: Response) {
    const user = await userService.invite(req.body);
    res.status(201).json(user);
  },

  async update(req: Request<GetUserParams>, res: Response) {
    const user = await userService.update(req.params.id, req.body);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json(user);
  },
};
