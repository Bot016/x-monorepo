import type { Request, Response } from "express";
import { patientGuardianService } from "../services/patientGuardian.service.js";
import type { GetPatientGuardianParams } from "../types/patientGuardian.schema.js";

export const patientGuardianController = {
  async getById(req: Request<GetPatientGuardianParams>, res: Response) {
    try {
      const guardian = await patientGuardianService.getById(req.params.id);
      if (!guardian) {
        return res.status(404).json({ error: "Responsável não encontrado" });
      }
      return res.json(guardian);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  },

  async getAll(_: Request, res: Response) {
    try {
      const guardians = await patientGuardianService.getAll();
      return res.json(guardians);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  },

  async create(req: Request, res: Response) {
    try {
      // A validação do body idealmente ocorre num middleware antes de chegar aqui
      const guardian = await patientGuardianService.create(req.body);
      return res.status(201).json(guardian);
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(409).json({ error: "Este CPF já está cadastrado." });
      }
      console.error(error);
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  },

  async update(req: Request<GetPatientGuardianParams>, res: Response) {
    try {
      const guardian = await patientGuardianService.update(req.params.id, req.body);
      if (!guardian) {
        return res.status(404).json({ error: "Responsável não encontrado" });
      }
      return res.json(guardian);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  },

  async delete(req: Request<GetPatientGuardianParams>, res: Response) {
    try {
      const result = await patientGuardianService.delete(req.params.id);
      if (!result) {
        return res.status(404).json({ error: "Responsável não encontrado" });
      }
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  },
};