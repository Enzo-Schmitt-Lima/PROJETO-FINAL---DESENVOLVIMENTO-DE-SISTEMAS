import { Request, Response } from "express";
import { FinishOrderService } from "../../services/order/FinishOrderService";

class FinishOrderController {
  async handle(req: Request, res: Response): Promise<void> {
    const { order_id } = req.body;

    if (!order_id) {
      res.status(400).json({ error: "order_id é obrigatório" });
      return;
    }

    const service = new FinishOrderService();

    try {
      const order = await service.execute({ order_id });
      res.status(200).json(order);
    } catch (err: any) {
      console.error("ERRO AO FINALIZAR PEDIDO:", err);
      if (err.message === "Pedido não encontrado") {
        res.status(404).json({ error: err.message });
      } else {
        res.status(500).json({ error: "Erro ao finalizar pedido" });
      }
    }
  }
}

export { FinishOrderController };
