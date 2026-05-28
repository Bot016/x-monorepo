import { z } from "zod";
import type { User } from "../generated/prisma/index.js";

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
});

export const getUserParamsSchema = z.object({
  id: z.uuid(),
});

export type createUserInput = z.infer<typeof createUserSchema>;

export type UserDTO = Pick<User, "id" | "name" | "email">;
export type GetUserParams = z.infer<typeof getUserParamsSchema>;
