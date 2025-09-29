import { Request, Response } from "express";
import { UpdatePresenteAdicionalService } from "../../services/Adicionais/UpdatePresenteAdicionalService";

class UpdatePresenteAdicionalController {
  async handle(req: Request, res: Response): Promise<void> {
    const { adicionalId, presente } = req.body;

    if (!adicionalId || typeof presente !== "boolean") {
      res.status(400).json({ error: "adicionalId e presente (boolean) são obrigatórios" });
      return;
    }

    const service = new UpdatePresenteAdicionalService();
    try {
      const atualizado = await service.execute({ adicionalId, presente });
      res.status(200).json(atualizado);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}

export { UpdatePresenteAdicionalController };
