import prismaClient from "../../../prisma";

class ListOrdersService{
    async execute() {
        const orders = await prismaClient.order.findMany({
            where: { draft: false },
            include: {
                items: { include: { product: true } },
                table: true,
                pagamento: true
            },
            orderBy: { created_at: 'desc' }
        });

        const statusTextMap: any = {
            0: 'Em preparo',
            1: 'Em preparo',
            2: 'Pronto',
            3: 'Finalizado'
        };

        const mapMetodo: any = {
            0: 'Pix',
            1: 'Débito',
            2: 'Crédito',
            3: 'Dinheiro físico (pagar com o garçom)'
        };

        const ordersWithText = orders.map(order => ({
            ...order,
            statusText: typeof order.status === 'number' ? statusTextMap[order.status] : undefined,
            pagamento: (order.pagamento || []).map((p: any) => ({
                ...p,
                statusText: p.statusText || (p.metodo !== undefined ? mapMetodo[p.metodo] : undefined)
            }))
        }));

        return ordersWithText;
    }
}

export { ListOrdersService }
