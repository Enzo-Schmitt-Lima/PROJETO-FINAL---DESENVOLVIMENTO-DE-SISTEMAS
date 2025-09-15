import prismaClient from "../../../prisma";
import { hash } from "bcryptjs";

interface UserRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  async execute({ name, email, password }: UserRequest) {
    if (!email) {
      throw new Error("Email incorrect");
    }

    const userAlreadyExists = await prismaClient.user.findFirst({
      where: { email },
    });
    if (userAlreadyExists) {
      throw new Error("User already exists");
    }

    const passwordHash = await hash(password, 8);

    // Busca o role padrão "cliente"
    const defaultRole = await prismaClient.role.findFirst({
      where: { name: "cliente" },
    });

    if (!defaultRole) {
      throw new Error("Role padrão 'cliente' não encontrado");
    }

    const user = await prismaClient.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        roles_id: defaultRole.id, // associando o role
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return user;
  }
}

export { CreateUserService };
