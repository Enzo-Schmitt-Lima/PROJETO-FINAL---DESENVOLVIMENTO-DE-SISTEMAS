import prismaClient from "../../../prisma";

interface FinishOrderRequest {
  order_id: string;
  paymentMethod?: number; // opcional, se quiser atualizar o metodo
}

class FinishOrderService {
  async execute({ order_id, paymentMethod }: FinishOrderRequest) {
    // 1️⃣ Busca o pedido
    const order = await prismaClient.order.findUnique({
      where: { id: order_id },
      include: { items: { include: { product: true } }, pagamento: true },
    });

    if (!order) {
      throw new Error("Pedido não encontrado");
    }

    // 2️⃣ Calcula o total
    const total = order.items.reduce(
      (sum, i) => sum + parseFloat(i.product.price) * i.amount,
      0
    );

    // 3️⃣ Atualiza o pagamento
    let pagamento = order.pagamento[0]; // considerando que só existe 1 pagamento por pedido

    if (pagamento) {
      pagamento = await prismaClient.pagamento.update({
        where: { id: pagamento.id },
        data: {
          amount: total,
          status: 1, // pago
          ...(paymentMethod !== undefined && { metodo: paymentMethod }),
        },
      });
    } else {
      pagamento = await prismaClient.pagamento.create({
        data: {
          order_id,
          amount: total,
          status: 1,
          metodo: paymentMethod ?? 0,
        },
      });
    }

    // 4️⃣ Atualiza o status do pedido
    const updatedOrder = await prismaClient.order.update({
      where: { id: order_id },
      data: { status: 3 }, // pedido finalizado
    });

    return { order: updatedOrder, pagamento };
  }
}

export { FinishOrderService };
