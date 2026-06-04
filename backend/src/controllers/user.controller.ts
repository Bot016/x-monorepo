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

  async delete(req: Request<GetUserParams>, res: Response) {
    const result = await userService.delete(req.params.id, req.user!.id);
    if (!result.ok) {
      const status = { not_found: 404, self_delete: 403, last_admin: 409 }[
        result.reason
      ];
      const message = {
        not_found: "Usuário não encontrado",
        self_delete: "Não é possível excluir a própria conta",
        last_admin: "Não é possível excluir o último administrador",
      }[result.reason];
      return res.status(status).json({ error: message });
    }
    res.json(result.user);
  },
};
