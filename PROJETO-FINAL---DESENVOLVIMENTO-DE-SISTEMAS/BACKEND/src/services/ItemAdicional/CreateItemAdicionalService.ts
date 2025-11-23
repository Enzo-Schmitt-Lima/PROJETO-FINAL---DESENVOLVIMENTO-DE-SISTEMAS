import { randomUUID } from 'crypto';
import prismaClient from "../../../prisma";

interface AddAdicionalRequest {
  item_id: string;
  adicional_id: string;
}

class AddAdicionalService {
  async execute({ item_id, adicional_id }: AddAdicionalRequest) {
    const item = await prismaClient.item.findUnique({
      where: { id: item_id },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!item) {
      throw new Error("Item não encontrado");
    }

    // Check if the product's category allows 'adicionais'
    const allowedCategories = ["Pizzas Clássicas", "Pizzas Especiais"];
    if (!allowedCategories.includes(item.product.category.name)) {
        throw new Error("Adicionais só podem ser adicionados em pizzas.");
    }

    const adicional = await prismaClient.adicionais.findUnique({
      where: { id: adicional_id },
    });
    if (!adicional) throw new Error("Adicional não encontrado");

    const existingItemAdicional = await prismaClient.itemAdicional.findFirst({
      where: {
        itemId: item_id,
        adicionalId: adicional_id,
      },
    });

    let updatedItemAdicional;
    if (existingItemAdicional) {
      // Se já existe, incrementa a quantidade
      updatedItemAdicional = await prismaClient.itemAdicional.update({
        where: { id: existingItemAdicional.id },
        data: { quantity: existingItemAdicional.quantity + 1 },
      });
    } else {
      // Se não existe, cria um novo com quantidade 1
      updatedItemAdicional = await prismaClient.itemAdicional.create({
        data: {
          id: randomUUID(),
          itemId: item_id,
          adicionalId: adicional_id,
          quantity: 1,
        },
      });
    }

    // Recalcula o total do pedido
    const items = await prismaClient.item.findMany({
      where: { order_id: item.order_id },
      include: {
        product: true,
        ItemAdicional: { include: { adicionais: true } },
      },
    });

    const total = items.reduce((sum, currentItem) => {
      const productPrice = parseFloat(currentItem.product.price) * currentItem.amount;
      const adicionaisTotal = currentItem.ItemAdicional.reduce((adicionalSum, itemAdicional) => {
        return adicionalSum + (itemAdicional.adicionais.price * itemAdicional.quantity);
      }, 0);
      return sum + productPrice + adicionaisTotal;
    }, 0);

    // Atualiza o pagamento
    await prismaClient.pagamento.updateMany({
      where: { order_id: item.order_id },
      data: { amount: total },
    });

    return updatedItemAdicional;
  }
}

export { AddAdicionalService };
