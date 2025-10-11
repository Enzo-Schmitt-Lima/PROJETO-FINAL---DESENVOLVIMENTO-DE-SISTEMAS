import prismaClient from "../../../prisma";

interface DetailRequest {
    order_id: string;
}

class DetailOrderService{
    async execute({ order_id }: DetailRequest){
        // Busca itens do pedido
        const items = await prismaClient.item.findMany({
            where: { order_id },
            include: { product: true, order: true }
        });

        // Busca pagamento do pedido
        const pagamento = await prismaClient.pagamento.findMany({
            where: { order_id }
        });

        return {
            items,
            pagamento
        };
    }
}

export { DetailOrderService }