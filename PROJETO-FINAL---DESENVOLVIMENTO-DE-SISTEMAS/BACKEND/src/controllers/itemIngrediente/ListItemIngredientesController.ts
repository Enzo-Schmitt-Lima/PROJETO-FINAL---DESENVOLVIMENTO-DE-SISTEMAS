import { Request, Response } from "express";
import { ListItemIngredientesService } from "../../services/itemIngrediente/ListItemIngredientesService";

class ListItemIngredientesController {
  async handle(req: Request, res: Response) {
    const { item_id } = req.query as { item_id: string };

    const listItemIngredientesService = new ListItemIngredientesService();

    const result = await listItemIngredientesService.execute({
      item_id,
    });

    return res.json(result);
  }
}

export { ListItemIngredientesController };
