import { Request, Response } from "express";
import { UpdatePagamentoStatusService } from "../../services/Pagamento/StatusPagamentoService";

export enum PagamentoStatus {
  PENDING = 0,
  PAID = 1,
  CANCELLED = 2,
}

class UpdatePagamentoStatusController {
  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { pagamento_id, status } = req.body;

      // converte para enum
      const statusEnum = Number(status) as PagamentoStatus;

      const service = new UpdatePagamentoStatusService();

      const payment = await service.execute({
        pagamento_id: String(pagamento_id),
        status: statusEnum,
      });

      res.json(payment);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}

export { UpdatePagamentoStatusController };
