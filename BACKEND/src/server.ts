import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Rota para criar um novo pedido e ocupar a mesa
app.post('/order', async (req, res) => {
  const { tableNumber } = req.body;

  try {
    const table = await prisma.table.update({
      where: { number: tableNumber },
      data: { status: 'occupied' },
    });

    const newOrder = await prisma.order.create({
      data: {
        tableId: table.id,
        status: 'open',
      },
    });

    return res.status(201).json(newOrder);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao criar pedido.' });
  }
});

// Rota para adicionar itens a um pedido
app.post('/order/add', async (req, res) => {
  const { order_id, items } = req.body;

  try {
    const orderItems = items.map((item: { product_id: string; amount: number; }) => ({
      orderId: order_id,
      productId: item.product_id,
      amount: item.amount,
    }));

    const newOrderItems = await prisma.orderItem.createMany({
      data: orderItems,
      skipDuplicates: true, // Garante que não haja itens duplicados
    });

    // Atualiza o status do pedido para "in_progress" (em progresso)
    const updatedOrder = await prisma.order.update({
      where: { id: order_id },
      data: { status: 'in_progress' },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return res.status(200).json(updatedOrder);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao adicionar itens ao pedido.' });
  }
});

// Rota para finalizar um pedido e liberar a mesa
app.put('/order/payment/:order_id', async (req, res) => {
  const { order_id } = req.params;

  try {
    // 1. Atualiza o status do pedido para 'finished'
    const updatedOrder = await prisma.order.update({
      where: { id: order_id },
      data: { status: 'finished' },
    });

    // 2. Libera a mesa associada
    const tableId = updatedOrder.tableId;
    await prisma.table.update({
      where: { id: tableId },
      data: { status: 'free' },
    });

    return res.status(200).json({ message: 'Pedido finalizado e mesa liberada com sucesso.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao finalizar o pagamento.' });
  }
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
