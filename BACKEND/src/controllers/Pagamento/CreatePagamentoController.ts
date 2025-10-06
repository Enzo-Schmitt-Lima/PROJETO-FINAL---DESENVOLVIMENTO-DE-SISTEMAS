import { Request, Response } from "express";
import { CreatePagamentoService } from "../../services/Pagamento/CreatePagamentoService";

class CreatePagamentoController {
  async handle(req: Request, res: Response): Promise<void> {
    const { order_id, amount, metodo } = req.body;

    if (!order_id) {
      res.status(400).json({ error: "order_id é obrigatório" });
      return;
    }

    const service = new CreatePagamentoService();

    try {
      const pagamento = await service.execute({
        order_id,
        amount: amount || 0,
        metodo: metodo || 0,
      });
      res.status(201).json(pagamento);
    } catch (err: any) {
      console.error("ERRO AO CRIAR PAGAMENTO:", err);
      res.status(500).json({ error: "Erro ao criar pagamento" });
    }
  }
}

export { CreatePagamentoController };
