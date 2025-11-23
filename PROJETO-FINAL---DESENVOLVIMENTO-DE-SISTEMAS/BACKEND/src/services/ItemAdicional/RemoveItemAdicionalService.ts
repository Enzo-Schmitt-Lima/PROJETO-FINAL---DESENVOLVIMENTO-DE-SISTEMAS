import prismaClient from "../../../prisma";

interface RemoveAdicionalRequest {
  item_adicional_id: string;
}

class RemoveAdicionalService {
  async execute({ item_adicional_id }: RemoveAdicionalRequest) {
    const itemAdicional = await prismaClient.itemAdicional.findUnique({
      where: { id: item_adicional_id },
      include: { items: true },
    });

    if (!itemAdicional) {
      throw new Error("Adicional do item não encontrado");
    }

    // Decrementa ou remove
    if (itemAdicional.quantity > 1) {
      await prismaClient.itemAdicional.update({
        where: { id: item_adicional_id },
        data: { quantity: itemAdicional.quantity - 1 },
      });
    } else {
      await prismaClient.itemAdicional.delete({
        where: { id: item_adicional_id },
      });
    }

    // Recalcula o total do pedido
    const items = await prismaClient.item.findMany({
      where: { order_id: itemAdicional.items.order_id },
      include: {
        product: true,
        ItemAdicional: { include: { adicionais: true } },
      },
    });

    const total = items.reduce((sum, currentItem) => {
      const productPrice = parseFloat(currentItem.product.price) * currentItem.amount;
      const adicionaisTotal = currentItem.ItemAdicional.reduce((adicionalSum, ia) => {
        return adicionalSum + (ia.adicionais.price * ia.quantity);
      }, 0);
      return sum + productPrice + adicionaisTotal;
    }, 0);
    
    // Atualiza o pagamento
    await prismaClient.pagamento.updateMany({
      where: { order_id: itemAdicional.items.order_id },
      data: { amount: total },
    });

    return { message: "Adicional removido com sucesso" };
  }
}

export { RemoveAdicionalService };
