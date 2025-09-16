import { Request, Response } from "express";
import { CreateOrderService } from "../../services/order/CreateOrderService";

class CreateOrderController {
  async handle(req: Request, res: Response) {
    try {
      const { table } = req.body; // table = ID da mesa

      const createOrderService = new CreateOrderService();
      const order = await createOrderService.execute({ tableId: table });

      res.json(order);
    } catch (err: any) {
      console.log("Erro ao criar pedido:", err.message);
      res.status(400).json({ error: err.message || "Erro ao criar pedido" });
    }
  }
}

export { CreateOrderController };
