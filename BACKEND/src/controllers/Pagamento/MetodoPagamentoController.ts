// src/controllers/Pagamento/MetodoPagamentoController.ts
import { Request, Response } from "express";
import { MetodoPagamentoService } from "../../services/Pagamento/MetodoPagamentoService";

export enum MetodoPagamento {
  PIX = 0,
  DEBITO = 1,
  CREDITO = 2,
  DINHEIRO_FÍSICO = 3,
}

class MetodoPagamentoController {
  async handle(req: Request, res: Response): Promise<void> {
    const { pagamento_id, metodo } = req.body;

    const service = new MetodoPagamentoService();

    const pagamento = await service.execute({
      id: String(pagamento_id),
      metodo: Number(metodo) as MetodoPagamento,
    });

    res.json(pagamento);
  }
}

export { MetodoPagamentoController };
