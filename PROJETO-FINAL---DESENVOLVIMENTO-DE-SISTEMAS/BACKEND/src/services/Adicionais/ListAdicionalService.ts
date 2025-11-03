import prismaClient from "../../../prisma";

class ListAdicionalService{
    async execute(){ 
        const adicional = await prismaClient.adicionais.findMany({
            select:{
                id: true,
                name: true,
                price: true,
            }
        })
        return adicional
    }
}

export { ListAdicionalService }