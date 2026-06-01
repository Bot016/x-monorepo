import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { getUserParamsSchema } from "../types/user.schema.js";

export const userRouter: Router = Router();

userRouter.use(requireAuth);
userRouter.get("/me", userController.getMe);

userRouter.get(
  "/:id",
  validate(getUserParamsSchema, "params"),
  userController.getById,
);
