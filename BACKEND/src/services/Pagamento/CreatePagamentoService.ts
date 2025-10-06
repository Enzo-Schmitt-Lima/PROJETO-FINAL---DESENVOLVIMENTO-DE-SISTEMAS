import prismaClient from "../../../prisma";

interface CreatePagamentoRequest {
  order_id: string;
  amount: number;
  metodo: number;
}

class CreatePagamentoService {
  async execute({ order_id, amount, metodo }: CreatePagamentoRequest) {
    // Verifica se o pedido existe
    const order = await prismaClient.order.findUnique({
      where: { id: order_id },
    });

    if (!order) {
      throw new Error("Pedido não encontrado");
    }

    // Verifica se já existe um pagamento para este pedido
    const existingPagamento = await prismaClient.pagamento.findFirst({
      where: { order_id },
    });

    if (existingPagamento) {
      throw new Error("Pagamento já existe para este pedido");
    }

    // Cria o pagamento
    const pagamento = await prismaClient.pagamento.create({
      data: {
        order_id,
        amount,
        status: 0, // PENDING
        metodo,
      },
    });

    return pagamento;
  }
}

export { CreatePagamentoService };
