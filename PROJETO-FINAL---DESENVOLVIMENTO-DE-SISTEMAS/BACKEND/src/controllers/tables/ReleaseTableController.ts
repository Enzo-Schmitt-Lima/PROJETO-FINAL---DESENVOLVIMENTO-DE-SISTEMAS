import { Request, Response } from "express";
import { ReleaseTableService } from "../../services/tables/ReleaseTableService";

class ReleaseTableController {
  async handle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tableId = Number(id);
      if (!tableId) return res.status(400).json({ error: 'table id inválido' });

      const service = new ReleaseTableService();
      const result = await service.execute(tableId);
      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}

export { ReleaseTableController };
