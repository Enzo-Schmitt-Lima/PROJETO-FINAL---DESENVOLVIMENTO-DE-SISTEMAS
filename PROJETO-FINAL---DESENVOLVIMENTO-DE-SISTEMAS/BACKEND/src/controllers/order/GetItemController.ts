import { Request, Response } from 'express';
import { GetItemService } from '../../services/order/GetItemService';

class GetItemController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }

    const getItemService = new GetItemService();

    try {
      const item = await getItemService.execute({ id: id as string });
      return res.json(item);
    } catch (err) {
      console.log('Error getting item:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export { GetItemController };
