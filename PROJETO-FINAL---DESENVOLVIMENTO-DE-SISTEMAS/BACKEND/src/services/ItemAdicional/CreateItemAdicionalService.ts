import prismaClient from "../../../prisma";

interface AddAdicionalRequest {
  item_id: string;
  adicional_id: string;
}

class AddAdicionalService {
  async execute({ item_id, adicional_id }: AddAdicionalRequest) {
    // Verifica se o item existe
    const item = await prismaClient.item.findUnique({
      where: { id: item_id },
      include: { itemAdicional: true },
    });
    if (!item) throw new Error("Item não encontrado");

    // Verifica se o adicional existe
    const adicional = await prismaClient.adicionais.findUnique({
      where: { id: adicional_id },
    });
    if (!adicional) throw new Error("Adicional não encontrado");

    // Verifica se o adicional já foi adicionado ao item
    const existing = item.itemAdicional.find(a => a.adicionalId === adicional_id);
    if (existing) throw new Error("Adicional já adicionado a este item");

    // Cria o adicional no item
    await prismaClient.itemAdicional.create({
      data: {
        itemId: item_id,
        adicionalId: adicional_id,
        quantity: 1,
      },
    });

    // Recalcula total do pedido
    const items = await prismaClient.item.findMany({
      where: { order_id: item.order_id },
      include: { product: true, itemAdicional: { include: { adicional: true } } },
    });

    const total = items.reduce((sum, i) => {
      const adicionaisTotal = i.itemAdicional.reduce((a, ad) => a + ad.adicional.price, 0);
      return sum + i.amount * (parseFloat(i.product.price) + adicionaisTotal);
    }, 0);

    // Atualiza pagamento e comanda
    const pagamento = await prismaClient.pagamento.findFirst({ where: { order_id: item.order_id } });
    if (pagamento) {
      await prismaClient.pagamento.update({
        where: { id: pagamento.id },
        data: { amount: total },
      });
    }

    const comanda = await prismaClient.comanda.findFirst({ where: { order_id: item.order_id } });
    if (comanda) {
      await prismaClient.comanda.update({
        where: { id: comanda.id },
        data: { amount: total },
      });
    }

    return { message: "Adicional adicionado com sucesso", total };
  }
}

export { AddAdicionalService };
