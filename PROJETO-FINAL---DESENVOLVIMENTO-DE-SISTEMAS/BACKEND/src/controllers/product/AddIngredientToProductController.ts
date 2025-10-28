import { Request, Response } from "express";
import { AddIngredientToProductService } from "../../services/product/AddIngredientToProductService";

class AddIngredientToProductController {
  async handle(req: Request, res: Response) {
    const { product_id, ingredient_id } = req.body;

    const addIngredientToProductService = new AddIngredientToProductService();

    const productIngredient = await addIngredientToProductService.execute({
      product_id,
      ingredient_id,
    });

    res.json(productIngredient);
  }
}

export { AddIngredientToProductController };
