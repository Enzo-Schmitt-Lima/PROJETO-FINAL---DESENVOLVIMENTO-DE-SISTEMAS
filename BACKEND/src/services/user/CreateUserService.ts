import prismaClient from "../../../prisma"
import { hash } from 'bcryptjs'

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

        // Verifica se o usuário já existe
        const userAlreadyExists = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        });

        if (userAlreadyExists) {
            throw new Error("User already exists");
        }

        // Cria o hash da senha
        const passwordHash = await hash(password, 8);

        // Cria o usuário sem a coluna 'role'
        const user = await prismaClient.user.create({
            data: {
                name: name,
                email: email,
                password: passwordHash
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        });

        return user;
    }
}

export { CreateUserService }
