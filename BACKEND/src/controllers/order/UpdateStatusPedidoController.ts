import { Request, Response } from "express";
import { UpdateStatusPedidoService } from "../../services/order/UpdateStatusPedidoService";
import { StatusPedido } from "../../services/order/FinishOrderService";

class UpdateStatusPedidoController {
  async handle(req: Request, res: Response): Promise<void> {
    const { order_id, status } = req.body;

    if (!order_id || status === undefined) {
      res.status(400).json({ error: "order_id e status são obrigatórios" });
      return;
    }

    const service = new UpdateStatusPedidoService();

    try {
      const pedido = await service.execute({
        id: String(order_id),
        status: Number(status) as StatusPedido,
      });
      res.status(200).json(pedido);
    } catch (err: any) {
      console.error("ERRO AO ATUALIZAR STATUS:", err);
      if (err.message === "Pedido não encontrado") {
        res.status(404).json({ error: err.message });
      } else {
        res.status(500).json({ error: "Erro ao atualizar status" });
      }
    }
  }
}

export { UpdateStatusPedidoController };
