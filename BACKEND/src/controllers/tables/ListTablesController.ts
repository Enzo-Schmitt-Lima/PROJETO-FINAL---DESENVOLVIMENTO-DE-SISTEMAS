import { Request, Response } from "express";
import { ListTablesService } from "../../services/tables/ListTablesService";

class ListTablesController {
  async handle(req: Request, res: Response) {
    console.log('Rota /tables chamada');
    try {
      const service = new ListTablesService();
  const mesas = await service.execute();
  console.log('Mesas retornadas:', mesas);
  res.json(mesas);
    } catch (error) {
      console.error('Erro ao listar mesas:', error);
      res.status(500).json({ error: 'Erro interno ao listar mesas', details: error?.message });
    }
  }
}

export { ListTablesController };
