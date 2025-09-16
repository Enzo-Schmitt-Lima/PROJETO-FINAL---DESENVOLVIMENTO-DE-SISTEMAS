import prismaClient from "../../../prisma";

interface OrderRequest {
  table: number; // número da mesa
  name?: string;
}

class CreateOrderService {
  async execute({ table, name }: OrderRequest) {
    // Busca a mesa pelo número
    const tableFound = await prismaClient.table.findUnique({
      where: { number: table }
    });

    if (!tableFound) {
      throw new Error('Mesa não encontrada');
    }

    // Cria o pedido vinculado à mesa
    const order = await prismaClient.order.create({
      data: {
        tableId: tableFound.id,
        name: name || null
      }
    });

    return order;
  }
}

export { CreateOrderService };
