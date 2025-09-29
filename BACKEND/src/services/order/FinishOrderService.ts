import prismaClient from "../../../prisma";

interface OrderRequest {
    order_id: string;
}

class FinishOrderService{
    async execute({ order_id }: OrderRequest){
        console.log('FinishOrderService chamado para order_id:', order_id);
        // Atualiza status do pedido para finalizado e draft para false
        const order = await prismaClient.order.update({
            where:{ id: order_id },
            data:{ status: 1, draft: false }
        });

        // Busca todos os itens do pedido
        const itens = await prismaClient.item.findMany({
            where: { order_id: order_id }
        });
        console.log('Itens do pedido:', itens);

        // Soma o valor total dos itens
        let total = 0;
        for (const item of itens) {
            const produto = await prismaClient.product.findUnique({
                where: { id: item.product_id }
            });
            if (produto) {
                total += parseFloat(produto.price) * item.amount;
            }
        }
        console.log('Valor total calculado:', total);


        // Busca pagamento vinculado ao pedido
        const pagamento = await prismaClient.pagamento.findFirst({
            where: { order_id }
        });
        console.log('Pagamento encontrado:', pagamento);

        if (pagamento) {
            const pagamentoAtualizado = await prismaClient.pagamento.update({
                where: { id: pagamento.id },
                data: { amount: total, status: 1 }
            });
            

            console.log('Pagamento atualizado:', pagamentoAtualizado);
        } else {
            console.log('Nenhum pagamento encontrado para este pedido!');
        }

        return order;
    }
}

export { FinishOrderService }