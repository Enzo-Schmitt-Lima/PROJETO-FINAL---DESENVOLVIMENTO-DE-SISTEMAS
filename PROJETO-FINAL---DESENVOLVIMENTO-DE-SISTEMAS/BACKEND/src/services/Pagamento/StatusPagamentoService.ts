import prismaClient from "../../../prisma";
import { PagamentoStatus } from "../../controllers/Pagamento/StatusPedidoController";

// Interface para receber dados
interface UpdatePaymentStatusRequest {
  pagamento_id: string;
  status: PagamentoStatus;
}

class UpdatePagamentoStatusService {
  async execute({ pagamento_id, status }: UpdatePaymentStatusRequest) {
    // busca pagamento
    const pagamento = await prismaClient.pagamento.findUnique({
      where: { id: pagamento_id },
    });

    if (!pagamento) throw new Error("Pagamento não encontrado");

    // atualiza status
    const updatedPayment = await prismaClient.pagamento.update({
      where: { id: pagamento_id },
      data: { status },
    });

    if (status === PagamentoStatus.PAID) {
      // Calcular o valor total do pedido
      const orderItems = await prismaClient.item.findMany({
        where: { order_id: pagamento.order_id },
        include: { product: true },
      });

      console.log('Order items found:', orderItems.length);
      console.log('Order items details:', orderItems.map(item => ({
        product_name: item.product.name,
        amount: item.amount,
        price: item.product.price,
        subtotal: item.amount * parseFloat(item.product.price)
      })));

      const totalAmount = orderItems.reduce((sum, item) => {
        return sum + item.amount * parseFloat(item.product.price);
      }, 0);

      console.log('Calculated total amount:', totalAmount);

      // Atualizar o valor do pagamento e status do pedido
      await prismaClient.pagamento.update({
        where: { id: pagamento_id },
        data: { amount: totalAmount },
      });

      await prismaClient.order.update({
        where: { id: pagamento.order_id },
        data: { status: 3 }, // FINALIZADO
      });

      console.log('Payment updated with amount:', totalAmount);
    }

    // retorna status legível
    const statusTextMap = {
      [PagamentoStatus.PENDING]: "Pendente",
      [PagamentoStatus.PAID]: "Pago",
      [PagamentoStatus.CANCELLED]: "Cancelado",
    };

    return {
      ...updatedPayment,
      statusText: statusTextMap[status],
    };
  }
}

export { UpdatePagamentoStatusService };
