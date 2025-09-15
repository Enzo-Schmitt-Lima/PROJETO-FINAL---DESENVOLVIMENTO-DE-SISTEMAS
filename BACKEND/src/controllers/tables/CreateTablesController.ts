import { Request, Response } from "express";
import { CreateTablesService } from "../../services/tables/CreateTablesService";

class CreateTablesController {
  async handle(req: Request, res: Response) {
    const service = new CreateTablesService();
    const tables = await service.execute();
    res.json(tables);
  }
}

export { CreateTablesController };
