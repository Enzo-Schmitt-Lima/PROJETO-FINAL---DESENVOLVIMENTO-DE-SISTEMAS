import { Request, Response } from "express";
import { RemoveIngredientFromProductService } from "../../services/product/RemoveIngredientFromProductService";

class RemoveIngredientFromProductController {
  async handle(req: Request, res: Response) {
    const { product_id, ingredient_id } = req.body;

    const removeIngredientFromProductService = new RemoveIngredientFromProductService();

    const result = await removeIngredientFromProductService.execute({
      product_id,
      ingredient_id,
    });

    res.json(result);
  }
}

export { RemoveIngredientFromProductController };
