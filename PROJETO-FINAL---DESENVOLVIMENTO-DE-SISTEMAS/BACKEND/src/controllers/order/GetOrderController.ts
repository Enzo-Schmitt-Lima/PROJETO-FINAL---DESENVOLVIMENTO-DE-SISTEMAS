import { Request, Response } from "express";
import prismaClient from "../../../prisma";

class GetOrderController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const order = await prismaClient.order.findUnique({
        where: { id },
        include: {
          items: { include: { product: true } },
          pagamento: true,
          table: true,
        },
      });

      if (!order) return res.status(404).json({ error: "Pedido não encontrado" });

      // Map status and pagamento metodo to human readable text for frontend
      const statusTextMap: any = {
        1: 'Em preparo',
        2: 'Pronto',
        3: 'Finalizado'
      };

      const MapMetodo: any = {
        0: 'Pix',
        1: 'Débito',
        2: 'Crédito',
        3: 'Dinheiro físico (pagar com o garçom)'
      };

      const orderWithText = {
        ...order,
        statusText: typeof order.status === 'number' ? statusTextMap[order.status] : undefined,
        pagamento: (order.pagamento || []).map((p: any) => ({
          ...p,
          statusText: p.statusText || (p.metodo !== undefined ? MapMetodo[p.metodo] : undefined),
        })),
      };

      return res.json(orderWithText);
    } catch (err: any) {
      console.error("GetOrderController error:", err.message || err);
      return res.status(500).json({ error: "Erro interno" });
    }
  }
}

export { GetOrderController };
