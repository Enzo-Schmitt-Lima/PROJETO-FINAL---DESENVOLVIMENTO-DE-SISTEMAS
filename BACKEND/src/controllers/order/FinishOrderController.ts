import { Request, Response } from "express";
import { FinishOrderService } from "../../services/order/FinishOrderService";

class FinishOrderController {
  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { order_id, paymentMethod } = req.body;

      const finishOrderService = new FinishOrderService();
      const result = await finishOrderService.execute({ order_id, paymentMethod });

      res.status(200).json(result);
    } catch (err: any) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  }
}

export { FinishOrderController };
