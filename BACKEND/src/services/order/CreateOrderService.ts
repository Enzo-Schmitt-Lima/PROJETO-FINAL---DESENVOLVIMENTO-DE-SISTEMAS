import prismaClient from "../../../prisma";

interface OrderRequest{
    table: number;
    name?: string;
}

class CreateOrderService{
    async execute({ table, name }: OrderRequest) {
        
        const order = await prismaClient.order.create({
            data: {
                // Use 'connect' para criar o relacionamento com a tabela.
                // O Prisma espera um objeto, não um número simples.
                table: {
                    connect: {
                        id: table // Conecta o pedido à tabela usando o ID da tabela
                    }
                },
                name: name
            }
        });

        

        return order;
    }
}

export { CreateOrderService };