import { Router } from "express";
import { patientController } from "../controllers/patient.controller.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/requireAuth.js";
import {
  createPatientSchema,
  getPatientParamsSchema,
  updatePatientSchema,
} from "../types/patient.schema.js";

export const patientRouter: Router = Router();

patientRouter.use(requireAuth);

patientRouter.get("/", patientController.list);
patientRouter.get(
  "/:id",
  validate(getPatientParamsSchema, "params"),
  patientController.getById,
);
patientRouter.post(
  "/",
  validate(createPatientSchema),
  patientController.create,
);
patientRouter.patch(
  "/:id",
  validate(getPatientParamsSchema, "params"),
  validate(updatePatientSchema),
  patientController.update,
);
patientRouter.delete(
  "/:id",
  validate(getPatientParamsSchema, "params"),
  patientController.delete,
);
