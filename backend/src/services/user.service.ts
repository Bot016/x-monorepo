import type { UserDTO } from "../types/user.schema.js";
import { userRepository } from "../repositories/user.repository.js";
import type { User } from "../generated/prisma/index.js";
import { supabaseAdmin } from "../config/supabase.js";
import type {
  InviteUserParams,
  UpdateUserParams,
} from "../types/user.schema.js";

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
      { data: { name } },
    );
    if (error) throw error;

    const userId = data.user.id;
    const roleRow = await userRepository.findRoleByName(role);
    await userRepository.assignRole(userId, roleRow.id);
    return userService.getById(userId);
  },
  async update(
    id: string,
    { name, roles }: UpdateUserParams,
  ): Promise<UserDTO | null> {
    const existing = await userRepository.findById(id);
    if (!existing) return null;

    if (name !== undefined) {
      await userRepository.updateName(id, name);
    }
    if (roles !== undefined) {
      await userService.setRoles(id, roles);
    }
    return userService.getById(id);
  },

  async setRoles(userId: string, roleNames: string[]): Promise<void> {
    const found = await userRepository.findRolesByNames(roleNames);
    if (found.length !== new Set(roleNames).size) {
      const known = new Set(found.map((r) => r.name));
      const unknown = roleNames.filter((n) => !known.has(n));
      throw new Error(`Cargo(s) inválido(s): ${unknown.join(", ")}`);
    }
    await userRepository.replaceUserRoles(
      userId,
      found.map((r) => r.id),
    );
  },
};
