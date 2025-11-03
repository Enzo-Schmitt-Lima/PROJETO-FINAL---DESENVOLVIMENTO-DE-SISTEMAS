import { Request, Response } from "express";
import { AddAdicionalService } from "../../services/ItemAdicional/CreateItemAdicionalService";

class AddItemAdicionalController {
  async handle(req: Request, res: Response) {
    try {
      const { item_id, adicional_id } = req.body;

      const service = new AddAdicionalService();
      const result = await service.execute({ item_id, adicional_id });

      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { AddItemAdicionalController };
