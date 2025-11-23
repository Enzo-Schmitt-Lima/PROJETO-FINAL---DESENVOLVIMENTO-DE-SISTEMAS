import { Request, Response } from "express";
import { OrphanCheckService } from "../../services/admin/OrphanCheckService";

class OrphanCheckController {
  async handle(req: Request, res: Response) {
    try {
      const service = new OrphanCheckService();
      const result = await service.execute();
      return res.json(result);
    } catch (err: any) {
      console.error("OrphanCheckController error:", err && err.stack ? err.stack : err);
      return res.status(500).json({ error: "Erro ao listar órfãos", details: err?.message || String(err) });
    }
  }
}

export { OrphanCheckController };
