const express = require('express');
import cors from 'cors';
import { router } from './routes';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(router);

// Rota para criar um novo pedido e ocupar a mesa
app.post('/order', async function (req, res) {
  const { tableNumber } = req.body;

  try {
    // Busca a mesa pelo número
    const table = await prisma.table.findUnique({
      where: { number: tableNumber },
    });
    if (!table) {
      return res.status(404).json({ error: 'Mesa não encontrada.' });
    }
    // Cria o pedido com status 0 (aberto)
    const newOrder = await prisma.order.create({
      data: {
        tableId: table.id,
        status: 0, // aberto
      },
    });
    return res.status(201).json(newOrder);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao criar pedido.' });
  }
});

// Rota para adicionar itens a um pedido
app.post('/order/add', async function (req, res) {
  const { order_id, items } = req.body;

  try {
    const orderItems = items.map((item: { product_id: string; amount: number; }) => ({
      order_id: order_id,
      product_id: item.product_id,
      amount: item.amount,
    }));

    // Cria os itens do pedido
    await prisma.item.createMany({
      data: orderItems,
      skipDuplicates: true,
    });

    // Atualiza o status do pedido para 1 (em progresso)
    const updatedOrder = await prisma.order.update({
      where: { id: order_id },
      data: { status: 1 },
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
app.put('/order/payment/:order_id', async function (req, res) {
  const { order_id } = req.params;
  try {
    // Chama o FinishOrderService para finalizar pedido e atualizar pagamento
    const { FinishOrderService } = require('./services/order/FinishOrderService');
    const finishOrderService = new FinishOrderService();
    const order = await finishOrderService.execute({ order_id });
    return res.status(200).json({ message: 'Pedido finalizado com sucesso.', order });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao finalizar o pagamento.' });
  }
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Servidor ligado!!!!!!!!!!!!!!!!!!! `);
});
