import type { Request, Response } from "express";
import { patientService } from "../services/patient.service.js";
import type { GetPatientParams } from "../types/patient.schema.js";

export const patientController = {
  async list(req: Request, res: Response) {
    const patients = await patientService.list(req.user!.id);
    res.json(patients);
  },

  async getById(req: Request<GetPatientParams>, res: Response) {
    const patient = await patientService.getById(req.params.id);
    if (!patient)
      return res.status(404).json({ error: "Paciente não encontrado" });
    res.json(patient);
  },

  async create(req: Request, res: Response) {
    const patient = await patientService.create(req.body);
    res.status(201).json(patient);
  },

  async update(req: Request<GetPatientParams>, res: Response) {
    const patient = await patientService.update(req.params.id, req.body);
    if (!patient)
      return res.status(404).json({ error: "Paciente não encontrado" });
    res.json(patient);
  },

  async delete(req: Request<GetPatientParams>, res: Response) {
    const patient = await patientService.delete(req.params.id);
    if (!patient)
      return res.status(404).json({ error: "Paciente não encontrado" });
    res.json(patient);
  },
};
