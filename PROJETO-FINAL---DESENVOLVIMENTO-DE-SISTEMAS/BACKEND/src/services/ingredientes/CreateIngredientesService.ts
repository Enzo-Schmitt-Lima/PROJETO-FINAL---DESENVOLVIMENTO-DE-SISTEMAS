import prismaClient from "../../../prisma";
interface ingredientRequest{
    name: string;
}

class CreateIngredienteService {
    async execute({ name }: ingredientRequest) {

        if (typeof name !== 'string' || name.trim() === '') {
            throw new Error('Name must be a non-empty string')
        }
        
        const ingrediente = await prismaClient.ingredientes.create({
            data: {
                name: name
            },
            select:{
                id: true,
                name: true
            },
        });

        return ingrediente;
    }
}

export { CreateIngredienteService }