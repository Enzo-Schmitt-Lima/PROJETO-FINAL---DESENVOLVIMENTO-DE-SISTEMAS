import { Request, Response } from "express";
import { FinishOrderService } from "../../services/order/FinishOrderService";

class FinishOrderController{
    async handle(req: Request, res: Response){
        const order_id = req.body.order_id || req.params.orderId;

    if (!order_id) {
      res.status(400).json({ error: "order_id é obrigatório" });
      return;
    }

    const service = new FinishOrderService();

        const order = await finishOrderService.execute({
            order_id
        });

        res.json(order);
    }
}

export { FinishOrderController }
