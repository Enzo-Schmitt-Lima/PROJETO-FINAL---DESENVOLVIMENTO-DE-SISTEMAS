import { Request, Response } from "express";
import { AddIngredientToProductService } from "../../services/product/AddIngredientToProductService";

class AddIngredientToProductController {
  // MUDANÇA 1: Adicione o tipo de retorno ": Promise<void>"
  async handle(req: Request, res: Response): Promise<void> { 
    try {
      const { product_id, ingredient_id } = req.body;

      if (!product_id || !ingredient_id) {
        // MUDANÇA 2: Remova o "return" da linha abaixo
        res.status(400).json({ error: "Product ID and Ingredient ID are required" });
        return; // Adicione um return "vazio"
      }

      const addIngredientToProductService = new AddIngredientToProductService();

      const productIngredient = await addIngredientToProductService.execute({
        product_id,
        ingredient_id,
      });

      res.json(productIngredient);
      return; // MUDANÇA 3: Adicione um return "vazio"

    } catch (err) {
      res.status(400).json({ error: err.message });
      return; // MUDANÇA 4: Adicione um return "vazio"
    }
  }
}

export { AddIngredientToProductController };