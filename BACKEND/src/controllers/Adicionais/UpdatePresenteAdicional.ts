import { Request, Response } from "express";
import { UpdatePresenteAdicionalService } from "../../services/Adicionais/UpdatePresenteAdicionalService";

class UpdatePresenteAdicionalController {
  async handle(req: Request, res: Response): Promise<void> {
    const { adicionalId, presente, adicionando } = req.body;

    if (!adicionalId || typeof presente !== "boolean" || typeof adicionando !== "boolean") {
      res.status(400).json({ error: "adicionalId, presente (boolean) e adicionando (boolean) são obrigatórios" });
      return;
    }

    const service = new UpdatePresenteAdicionalService();
    try {
      const atualizado = await service.execute({ adicionalId, presente, adicionando });
      res.status(200).json(atualizado);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}

export { UpdatePresenteAdicionalController };
