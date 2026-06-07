// symptom.controller.ts
import type { Request, Response } from "express";
import { symptomService } from "../services/symptom.service.js";
import type { SexOption } from "../repositories/symptom.repository.js";

export const symptomController = {
  async getBySex(req: Request, res: Response) {
    try {
      const sexQuery = (req.query.sex as string) || '';

      if (sexQuery !== 'm' && sexQuery !== 'f' && sexQuery !== '') {
        return res.status(400).json({ error: "O parâmetro sex deve ser 'm', 'f' ou vazio." });
      }

      const symptoms = await symptomService.getBySex(sexQuery as SexOption);
      
      return res.json(symptoms);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  },
};