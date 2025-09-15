import prismaClient from "../../../prisma"
import { hash } from 'bcryptjs'

interface CostumerRequest {
    name: string;
    email: string;
    password: string;
    birth_date: Date;
}

class CreateCostumerService {
    async execute({ name, email, password, birth_date }: CostumerRequest) {

        if (!email) {
            throw new Error("Email incorrect");
        }

        // Verifica se o usuário já existe
        const costumerAlreadyExists = await prismaClient.costumer.findFirst({
            where: {
                email: email
            }
        });

        if (costumerAlreadyExists) {
            throw new Error("User already exists");
        }

        // Cria o hash da senha
        const passwordHash = await hash(password, 8);


        // Cria o usuário sem a coluna 'role'
        const costumer = await prismaClient.costumer.create({
            data: {
                name: name,
                email: email,
                password: passwordHash,
                birth_date
            },
            select: {
                id: true,
                name: true,
                email: true,
                birth_date: true
            }
        });

        return costumer;
    }
}

export { CreateCostumerService }