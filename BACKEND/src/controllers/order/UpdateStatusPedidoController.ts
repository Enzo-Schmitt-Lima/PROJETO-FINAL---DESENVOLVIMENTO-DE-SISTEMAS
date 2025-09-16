import { Request, Response } from "express";
import { UpdateStatusPedidoService } from "../../services/order/UpdateStatusPedidoService";

export enum StatusPedido {
  INDO_PREPARO = 0,
  PREPARANDO = 1,
  PRONTO = 2,
}

class UpdateStatusPedidoController {
  async handle(req: Request, res: Response): Promise<void> {
      const { order_id, status } = req.body; 

      const service = new UpdateStatusPedidoService();

      const pedido = await service.execute({
        id: String(order_id),
        status: Number(status) as StatusPedido,
      });

      res.json(pedido);
    } 
  }

export { UpdateStatusPedidoController };
