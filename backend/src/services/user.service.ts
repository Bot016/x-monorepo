import type { UserDTO } from "../types/user.schema.js";
import { userRepository } from "../repositories/user.repository.js";
import type { User } from "../generated/prisma/index.js";

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
};
