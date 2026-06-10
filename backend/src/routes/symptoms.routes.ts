import { Router } from "express";
import { symptomController } from "../controllers/symptom.controller.js";

export const symptomRouter: Router = Router();

symptomRouter.get("/", symptomController.getBySex);
