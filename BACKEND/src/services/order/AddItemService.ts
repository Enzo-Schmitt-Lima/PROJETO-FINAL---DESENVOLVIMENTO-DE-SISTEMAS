import prismaClient from "../../../prisma";

interface ItemRequest {
  order_id: string;
  product_id: string;
  amount: number;
}

class AddItemService {
  async execute({ order_id, product_id, amount }: ItemRequest) {
    console.log('AddItemService chamado para order_id:', order_id, 'product_id:', product_id, 'amount:', amount);
    // Verifica se o produto existe
    const product = await prismaClient.product.findUnique({
      where: { id: product_id },
    });
    if (!product) throw new Error("Produto não encontrado");

    // Cria o item
    const item = await prismaClient.item.create({
      data: {
        order_id,
        product_id,
        amount,
      },
    });

    // Calcula o total do pedido
    const items = await prismaClient.item.findMany({
      where: { order_id },
      include: { product: true },
    });

    const total = items.reduce(
      (sum, i) => sum + parseFloat(i.product.price) * i.amount,
      0
    );

    // Atualiza o valor do pagamento já existente
    let pagamento = await prismaClient.pagamento.findFirst({
      where: { order_id },
    });
    if (pagamento) {
      console.log('Pagamento antes de atualizar:', pagamento);
      pagamento = await prismaClient.pagamento.update({
        where: { id: pagamento.id },
        data: { amount: total },
      });
      console.log('Pagamento atualizado:', pagamento);
    }


    // Cria ou atualiza a comanda vinculando o pagamento
    const existingComanda = await prismaClient.comanda.findFirst({
      where: { order_id },
    });

    if (existingComanda) {
      await prismaClient.comanda.update({
        where: { id: existingComanda.id },
        data: {
          amount: total,
          pagamento_id: pagamento.id,
        },
      });
    } else {
      await prismaClient.comanda.create({
        data: {
          order_id,
          amount: total,
          pagamento_id: pagamento.id,
        },
      });
    }

    return { item, pagamento };
  }
}

export { AddItemService };
