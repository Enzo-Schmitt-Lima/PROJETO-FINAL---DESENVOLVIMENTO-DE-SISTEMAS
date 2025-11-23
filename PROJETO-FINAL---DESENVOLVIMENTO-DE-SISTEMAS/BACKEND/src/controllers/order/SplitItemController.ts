import { Request, Response } from 'express';
import { SplitItemService } from '../../services/order/SplitItemService';

class SplitItemController {
  async handle(req: Request, res: Response) {
    try {
      const { item_id, quantity } = req.body;
      const service = new SplitItemService();
      const newItem = await service.execute({ item_id, quantity });
      return res.json(newItem);
    } catch (err: any) {
      return res.status(400).json({ error: err.message || err });
    }
  }
}

export { SplitItemController };
