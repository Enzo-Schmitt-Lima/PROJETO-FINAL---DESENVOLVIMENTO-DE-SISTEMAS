import { Request, Response } from "express";
import { RemoveItemIngredienteService } from "../../services/itemIngrediente/RemoveItemIngredienteService";

class RemoveItemIngredienteController {
  async handle(req: Request, res: Response) {
    const { item_id, ingrediente_id } = req.body;

    const removeItemIngredienteService = new RemoveItemIngredienteService();

    const result = await removeItemIngredienteService.execute({
      item_id,
      ingrediente_id,
    });

    return res.json(result);
  }
}

export { RemoveItemIngredienteController };
