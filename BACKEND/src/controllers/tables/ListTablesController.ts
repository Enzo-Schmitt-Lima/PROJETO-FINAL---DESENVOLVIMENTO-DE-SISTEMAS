import { Request, Response } from "express";
import { ListTablesService } from "../../services/tables/ListTablesService";

class ListTablesController {
  async handle(req: Request, res: Response) {
    const service = new ListTablesService();
    const mesas = await service.execute();
    res.json(mesas);
  }
}

export { ListTablesController };
