import prismaClient from "../../../prisma";

interface ItemRequest {
  item_id: string;
}

class RemoveItemService {
  async execute({ item_id }: ItemRequest) {
    const item = await prismaClient.item.findUnique({
      where: { id: item_id },
    });

    if (!item) {
      throw new Error("Item não encontrado");
    }

      const order = await prismaClient.order.findUnique({
  where: { id: item.order_id },
});

if (!order) {
  throw new Error("Pedido não encontrado");
}

if (order.status >= 1) { 
  throw new Error("Não é possível remover itens de pedidos finalizados ou em andamento");
}

    const order_id = item.order_id;

    if (item.amount > 1) {
      await prismaClient.item.update({
        where: { id: item_id },
        data: { amount: item.amount - 1 },
      });
    } else {
      await prismaClient.item.delete({
        where: { id: item_id },
      });
    }

    const items = await prismaClient.item.findMany({
      where: { order_id },
      include: { product: true },
    });

    const total = items.reduce(
      (sum, i) => sum + parseFloat(i.product.price) * i.amount,
      0
    );

    const pagamento = await prismaClient.pagamento.findFirst({
      where: { order_id },
    });

    if (pagamento) {
      await prismaClient.pagamento.update({
        where: { id: pagamento.id },
        data: { amount: total },
      });
    }

    const comanda = await prismaClient.comanda.findFirst({
      where: { order_id },
    });

    if (comanda) {
      await prismaClient.comanda.update({
        where: { id: comanda.id },
        data: { amount: total },
      });
    }

    return { message: "Item removido com sucesso", total };
  }
}

export { RemoveItemService };
