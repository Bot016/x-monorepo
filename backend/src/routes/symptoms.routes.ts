import { Router } from "express";
import { symptomController } from "../controllers/symptom.controller.js";

export const symtomRouter: Router = Router();

symtomRouter.get("/", symptomController.getBySex);
