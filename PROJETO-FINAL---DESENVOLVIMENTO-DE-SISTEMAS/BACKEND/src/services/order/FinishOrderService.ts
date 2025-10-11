import prismaClient from "../../../prisma";

export enum StatusPedido {
  INDO_PREPARO = 0,
  PREPARANDO = 1,
  PRONTO = 2,
  FINALIZADO = 3,
}

interface FinishOrderRequest {
  order_id: string;
}

class FinishOrderService {
  async execute({ order_id }: FinishOrderRequest) {
    // Verifica se o pedido existe
    const order = await prismaClient.order.findUnique({
      where: { id: order_id },
      include: { items: { include: { product: true } }, table: true, pagamento: true },
    });

    if (!order) {
      throw new Error("Pedido não encontrado");
    }

    // Atualiza status para FINALIZADO e marca como não draft
    const updatedOrder = await prismaClient.order.update({
      where: { id: order_id },
      data: {
        status: StatusPedido.FINALIZADO,
        draft: false
      },
    });

    return {
      ...updatedOrder,
      statusText: StatusPedido[StatusPedido.FINALIZADO],
    };
  }
}

export { FinishOrderService };
