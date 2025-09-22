import prismaClient from "../../../prisma";

interface ItemRequest {
  order_id: string;
  product_id: string;
  amount: number;
}

class AddItemService {
  async execute({ order_id, product_id, amount }: ItemRequest) {
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

    // 3️⃣ Calcula o total do pedido
    const items = await prismaClient.item.findMany({
      where: { order_id },
      include: { product: true },
    });

    const total = items.reduce(
      (sum, i) => sum + parseFloat(i.product.price) * i.amount,
      0
    );

    // Cria o pagamento vinculado
    const pagamento = await prismaClient.pagamento.create({
      data: {
        order_id,
        amount: total,
        status: 0, 
        metodo: 0, 
      },
    });

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
