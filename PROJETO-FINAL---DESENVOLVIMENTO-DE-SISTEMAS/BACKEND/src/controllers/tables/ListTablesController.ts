import { Request, Response } from "express";
import { ListTablesService } from "../../services/tables/ListTablesService";

class ListTablesController {
  async handle(req: Request, res: Response) {
    console.log('Rota /tables chamada (ListTablesController)');
    console.log('Authorization header:', req.headers.authorization);
    // @ts-ignore
    console.log('req.user_id:', req.user_id);
    try {
      const service = new ListTablesService();
      const mesas = await service.execute();
      console.log('Mesas retornadas (controller):', mesas);
      res.json(mesas);
    } catch (error: any) {
      console.error('Erro no ListTablesController:', error);
      res.status(500).json({ error: 'Erro interno ao listar mesas', details: error?.message });
    }
  }
}

export { ListTablesController };
