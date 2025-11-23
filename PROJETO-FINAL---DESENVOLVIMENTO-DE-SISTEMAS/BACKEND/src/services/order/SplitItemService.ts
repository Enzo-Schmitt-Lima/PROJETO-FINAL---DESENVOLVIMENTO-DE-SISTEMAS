import { randomUUID } from 'crypto';
import prismaClient from "../../../prisma";
import { getIO } from "../../libs/socket";

interface SplitRequest {
  item_id: string;
  quantity?: number;
}

class SplitItemService {
  async execute({ item_id, quantity = 1 }: SplitRequest) {
    const item = await prismaClient.item.findUnique({
      where: { id: item_id },
      include: { ItemAdicional: true, ItemIngrediente: true },
    });
    if (!item) throw new Error('Item não encontrado');
    if (item.amount < quantity) throw new Error('Quantidade a separar maior que a disponível');

    // Decrement original item amount or remove it if amount becomes 0
    const remaining = item.amount - quantity;
    if (remaining > 0) {
      await prismaClient.item.update({ where: { id: item_id }, data: { amount: remaining } });
    } else {
      await prismaClient.item.delete({ where: { id: item_id } });
    }

    // Create new item with same relationships
    const newItem = await prismaClient.item.create({
      data: {
        id: randomUUID(),
        order_id: item.order_id,
        product_id: item.product_id,
        amount: quantity,
      },
    });

    // Duplicate ItemIngrediente entries
    for (const ii of item.ItemIngrediente) {
      await prismaClient.itemIngrediente.create({
        data: {
          itemId: newItem.id,
          ingredienteId: ii.ingredienteId,
          removed: ii.removed,
        },
      });
    }

    // Duplicate ItemAdicional entries (preserve quantity)
    for (const ia of item.ItemAdicional) {
      await prismaClient.itemAdicional.create({
        data: {
          id: randomUUID(),
          itemId: newItem.id,
          adicionalId: ia.adicionalId,
          quantity: ia.quantity,
        },
      });
    }

    // Recalculate total and update pagamento/comanda similar to AddItemService
    const items = await prismaClient.item.findMany({
      where: { order_id: item.order_id },
      include: { product: true, ItemAdicional: { include: { adicionais: true } } },
    });

    const total = items.reduce((sum, currentItem) => {
      const productPrice = parseFloat(currentItem.product.price) * currentItem.amount;
      const adicionaisTotal = currentItem.ItemAdicional.reduce((adicionalSum, itemAdicional) => {
        return adicionalSum + (itemAdicional.adicionais.price * itemAdicional.quantity);
      }, 0);
      return sum + productPrice + adicionaisTotal;
    }, 0);

    let pagamento = await prismaClient.pagamento.findFirst({ where: { order_id: item.order_id } });
    if (pagamento) {
      pagamento = await prismaClient.pagamento.update({ where: { id: pagamento.id }, data: { amount: total } });
    } else {
      pagamento = await prismaClient.pagamento.create({ data: { order_id: item.order_id, amount: total, status: 0, metodo: 0 } });
    }

    const existingComanda = await prismaClient.comanda.findFirst({ where: { order_id: item.order_id } });
    if (existingComanda) {
      await prismaClient.comanda.update({ where: { id: existingComanda.id }, data: { amount: total, pagamento_id: pagamento.id } });
    } else {
      await prismaClient.comanda.create({ data: { order_id: item.order_id, amount: total, pagamento_id: pagamento.id } });
    }

    try {
      const io = getIO();
      io.emit('order:update', { order_id: item.order_id, total, pagamento });
    } catch (err) {
      console.error('Socket emit falhou em SplitItemService:', err.message || err);
    }

    return newItem;
  }
}

export { SplitItemService };
