import type { UserDTO } from "../types/user.schema.js";
import { userRepository } from "../repositories/user.repository.js";
import type { User } from "../generated/prisma/index.js";
import { supabaseAdmin } from "../config/supabase.js";
import { prisma } from "../config/prisma.js";
import type { InviteUserParams } from "../types/user.schema.js";

export const userService = {
  async getById(id: string): Promise<UserDTO | null> {
    const user = await userRepository.findById(id);
    if (!user) return null;
    return { id: user.id, name: user.name, email: user.email };
  },
  async getUsers(): Promise<UserDTO[]> {
    const users = await userRepository.findAll();
    return users.map((user: User) => ({
      id: user.id,
      name: user.name,
      email: user.email,
    }));
  },
  async invite({
    name,
    email,
    role,
  }: InviteUserParams): Promise<UserDTO | null> {
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email,
      { data: { nome: name } },
    );
    if (error) throw error;

    const userId = data.user.id;
    const roleRow = await prisma.role.findUniqueOrThrow({
      where: { name: role },
    });
    await prisma.userRole.create({
      data: {
        userId,
        roleId: roleRow.id,
      },
    });
    return userService.getById(userId);
  },
};
