import prismaClient from "../../../prisma";

interface DetailRequest {
    order_id: string;
}

class DetailOrderService{
    async execute({ order_id }: DetailRequest){
        // Busca o pedido completo
        const order = await prismaClient.order.findUnique({
            where: { id: order_id },
            include: {
                items: { include: { product: true } },
                pagamento: true,
                table: true,
            }
        });

        if (!order) return { error: 'Pedido não encontrado' };

        // Map status to text
        const statusTextMap: any = {
            0: 'Em preparo',
            1: 'Em preparo',
            2: 'Pronto',
            3: 'Finalizado'
        };

        const MapMetodo: any = {
            0: 'Pix',
            1: 'Débito',
            2: 'Crédito',
            3: 'Dinheiro físico (pagar com o garçom)'
        };

        const orderWithText = {
            ...order,
            statusText: typeof order.status === 'number' ? statusTextMap[order.status] : undefined,
            pagamento: (order.pagamento || []).map((p: any) => ({
                ...p,
                statusText: p.statusText || (p.metodo !== undefined ? MapMetodo[p.metodo] : undefined)
            }))
        };

        return orderWithText;
    }
}

export { DetailOrderService }