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
      }
    });

    // Cria o pagamento inicial
    const pagamento = await prismaClient.pagamento.create({
      data: {
        order_id: order.id,
        amount: 0,
        status: 0,
        metodo: 0
      }
    });

    // Cria a comanda vinculada ao pedido e ao pagamento
    await prismaClient.comanda.create({
      data: {
        order_id: order.id,
        amount: 0,
        pagamento_id: pagamento.id
      }
    });

    return order;
  }
}

export { CreateOrderService };
