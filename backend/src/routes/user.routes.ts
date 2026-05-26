import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { validate } from "../middleware/validate.js";
import { getUserParamsSchema } from "../types/user.schema.js";

export const userRouter: Router = Router();

userRouter.get(
  "/:id",
  validate(getUserParamsSchema, "params"),
  userController.getById,
);
