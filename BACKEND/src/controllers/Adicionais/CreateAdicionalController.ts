import { Request, Response } from "express";
import { CreateAdicionalService } from "../../services/Adicionais/CreateAdicionalService";

class CreateAdicionalController {
  async handle(req: Request, res: Response): Promise<void> {
    const { produtoIngredienteId } = req.body;

    if (!produtoIngredienteId) {
      res.status(400).json({ error: "produtoIngredienteId é obrigatório" });
      return;
    }

    const service = new CreateAdicionalService();
    const adicional = await service.execute({ produtoIngredienteId });

    res.status(201).json(adicional);
  }
}

export { CreateAdicionalController };
