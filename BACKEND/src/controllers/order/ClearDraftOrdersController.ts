import { Request, Response } from "express";
import { ClearDraftOrdersService } from "../../services/order/ClearDraftOrdersService";

class ClearDraftOrdersController {
  async handle(req: Request, res: Response) {
    try {
      const service = new ClearDraftOrdersService();
      const result = await service.execute();

      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}

export { ClearDraftOrdersController };
