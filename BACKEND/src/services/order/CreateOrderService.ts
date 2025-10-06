import prismaClient from "../../../prisma";

interface OrderRequest {
  tableId: number; // ID da mesa
  name?: string;
}

class CreateOrderService {
  async execute({ tableId, name }: OrderRequest) {
    // Verifica se a mesa existe
    const tableFound = await prismaClient.table.findUnique({
      where: { id: tableId }
    });

    if (!tableFound) {
      throw new Error("Mesa não encontrada");
    }

    // Cria o pedido usando a relação
    const order = await prismaClient.order.create({
      data: {
        draft: true,
        status: 0,
        name: name || null,
        table: {
          connect: {
            id: tableId
          }
        }
      },
      include: {
        pagamento: true
      }
    });

    // Criar um pagamento associado ao pedido
    const pagamento = await prismaClient.pagamento.create({
      data: {
        order_id: order.id,
        amount: 0, // será atualizado depois
        status: 0, // PENDING
        metodo: 0, // será atualizado depois
      }
    });

    return {
      ...order,
      pagamento: [pagamento]
    };
  }
}

export { CreateOrderService };
