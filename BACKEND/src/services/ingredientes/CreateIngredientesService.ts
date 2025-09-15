import prismaClient from "../../../prisma";
interface ingredientRequest{
    name: string;
}

class CreateIngredienteService {
    async execute({ name }: ingredientRequest) {

        if(name === ''){
            throw new Error('Name invalid')
        }
        
        const ingrediente = await prismaClient.ingredientes.create({
            data: {
                name
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