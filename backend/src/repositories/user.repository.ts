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
  updateName(id: string, name: string) {
    return prisma.user.update({ where: { id }, data: { name } });
  },
  findRolesByNames(names: string[]) {
    return prisma.role.findMany({ where: { name: { in: names } } });
  },
  replaceUserRoles(userId: string, roleIds: number[]) {
    return prisma.$transaction(async (tx) => {
      await tx.userRole.updateMany({
        where: { userId, status: "active", roleId: { notIn: roleIds } },
        data: { status: "inactive" },
      });
      for (const roleId of roleIds) {
        const row = await tx.userRole.findFirst({ where: { userId, roleId } });
        if (!row) {
          await tx.userRole.create({ data: { userId, roleId } });
        } else if (row.status !== "active") {
          await tx.userRole.update({
            where: { id: row.id },
            data: { status: "active" },
          });
        }
      }
    });
  },
};
