import { z } from "zod";
import type { User } from "../generated/prisma/index.js";

export const getUserParamsSchema = z.object({
  id: z.uuid(),
});

export const updateUserSchema = z
  .object({
    name: z.string().min(1),
    roles: z.array(z.string().min(1)),
  })
  .partial();

export const inviteUserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  role: z.string().min(1),
});

export type UserDTO = Pick<User, "id" | "name" | "email">;
export type GetUserParams = z.infer<typeof getUserParamsSchema>;
export type UpdateUserParams = z.infer<typeof updateUserSchema>;
export type InviteUserParams = z.infer<typeof inviteUserSchema>;
