import prismaClient from "../../../prisma";
import { getIO } from "../../libs/socket";

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

    // Calcula o total do pedido
    const items = await prismaClient.item.findMany({
      where: { order_id },
      include: { product: true },
    });

    const total = items.reduce(
      (sum, i) => sum + parseFloat(i.product.price) * i.amount,
      0
    );

    // semelhante a função da comanda, atualiza se já existir
let pagamento = await prismaClient.pagamento.findFirst({
  where: { order_id },
});

if (pagamento) {
  pagamento = await prismaClient.pagamento.update({
    where: { id: pagamento.id },
    data: { amount: total },
  });
} else {
  pagamento = await prismaClient.pagamento.create({
    data: {
      order_id,
      amount: total,
      status: 0,
      metodo: 0,
    },
  });
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

    // Emite evento via socket com dados atualizados do pedido
    try {
      const io = getIO();
      io.emit("order:update", { order_id, total, pagamento });
    } catch (err) {
      console.error("Socket emit falhou em AddItemService:", err.message || err);
    }

    return { item, pagamento };
  }
}

export { AddItemService };
