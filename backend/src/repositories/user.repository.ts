import { prisma } from "../config/prisma.js";

export const userRepository = {
  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },
  findAll() {
    return prisma.user.findMany();
  },
  hasActiveRole(userId: string, roleName: string) {
    return prisma.userRole.findFirst({
      where: {
        userId,
        status: "active",
        role: { name: roleName },
      },
      select: { id: true },
    });
  },
};
