import prismaClient from "../../../prisma";

interface RoleRequest {
  name: string;
}

class CreateRoleService {
  async execute({ name }: RoleRequest) {
    if (!name) {
      throw new Error("Role name is required");
    }

    const roleAlreadyExists = await prismaClient.role.findFirst({
      where: { name }
    });

    if (roleAlreadyExists) {
      throw new Error("Role already exists");
    }

    const role = await prismaClient.role.create({
      data: { name },
      select: {
        id: true,
        name: true
      }
    });

    return role;
  }
}

export { CreateRoleService };
