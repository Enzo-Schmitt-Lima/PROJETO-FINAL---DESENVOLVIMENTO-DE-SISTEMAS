import { Request, Response } from "express";
import { AddItemIngredienteService } from "../../services/itemIngrediente/AddItemIngredienteService";

class AddItemIngredienteController {
  async handle(req: Request, res: Response) {
    const { item_id, ingrediente_id } = req.body;

    const addItemIngredienteService = new AddItemIngredienteService();

    const result = await addItemIngredienteService.execute({
      item_id,
      ingrediente_id,
    });

    return res.json(result);
  }
}

export { AddItemIngredienteController };
