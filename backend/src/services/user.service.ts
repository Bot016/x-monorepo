import type { UserDTO } from "../types/user.schema.js";
import { userRepository } from "../repositories/user.repository.js";

export const userService = {
  async getById(id: string): Promise<UserDTO | null> {
    const user = await userRepository.findById(id);
    if (!user) return null;
    return { id: user.id, name: user.name, email: user.email };
  },
};
