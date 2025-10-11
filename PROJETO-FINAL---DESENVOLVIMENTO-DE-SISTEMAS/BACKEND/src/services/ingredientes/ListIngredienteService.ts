import prismaClient from "../../../prisma";

class ListIngredienteService{
    async execute(){

        const ingrediente = await prismaClient.ingredientes.findMany({
            select:{
                id: true,
                name: true,
            }
        })

        return ingrediente
    }
}

export { ListIngredienteService }