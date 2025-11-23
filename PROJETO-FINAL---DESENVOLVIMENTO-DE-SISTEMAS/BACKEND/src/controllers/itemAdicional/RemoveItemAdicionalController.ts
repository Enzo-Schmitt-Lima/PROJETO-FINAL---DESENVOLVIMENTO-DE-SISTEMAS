import { Request, Response } from "express";
import { RemoveAdicionalService } from "../../services/ItemAdicional/RemoveItemAdicionalService";

class RemoveItemAdicionalController {
  async handle(req: Request, res: Response) {
    const { item_adicional_id } = req.query;

    if (!item_adicional_id) {
      return res.status(400).json({ error: "item_adicional_id is required" });
    }

    const service = new RemoveAdicionalService();
    try {
      const result = await service.execute({ item_adicional_id: item_adicional_id as string });
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { RemoveItemAdicionalController };
