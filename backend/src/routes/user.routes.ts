import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import {
  getUserParamsSchema,
  inviteUserSchema,
  updateUserSchema,
} from "../types/user.schema.js";

export const userRouter: Router = Router();

userRouter.use(requireAuth);
userRouter.get("/me", userController.getMe);
userRouter.get("/", requireAdmin, userController.getUsers);
userRouter.get(
  "/:id",
  validate(getUserParamsSchema, "params"),
  userController.getById,
);

userRouter.post(
  "/",
  requireAdmin,
  validate(inviteUserSchema),
  userController.invite,
);

userRouter.patch(
  "/:id",
  requireAdmin,
  validate(getUserParamsSchema, "params"),
  validate(updateUserSchema),
  userController.update,
);

userRouter.delete(
  "/:id",
  requireAdmin,
  validate(getUserParamsSchema, "params"),
  userController.delete,
);
