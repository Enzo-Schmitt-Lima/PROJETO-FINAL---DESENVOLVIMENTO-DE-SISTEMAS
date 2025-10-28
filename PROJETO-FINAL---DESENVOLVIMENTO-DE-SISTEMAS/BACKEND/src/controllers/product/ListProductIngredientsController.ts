// src/controllers/product/ListProductIngredientsController.ts

import { Request, Response } from "express";
import { ListProductIngredientsService } from "../../services/product/ListProductIngredientsService";

class ListProductIngredientsController {
  
  // Adicionamos o try...catch e o Promise<void>
  async handle(req: Request, res: Response): Promise<void> {
    
    try {
      // 1. Pegamos o ID da URL
      const { product_id } = req.query as { product_id: string };

      // 2. Verificamos se ele veio
      if (!product_id) {
        res.status(400).json({ error: "Missing product_id query parameter" });
        return;
      }

      const listProductIngredientsService = new ListProductIngredientsService();

      // 3. Executamos o serviço
      const ingredients = await listProductIngredientsService.execute({
        product_id,
      });

      // 4. Retornamos o resultado (que será um array)
      res.json(ingredients);
      return;

    } catch (err) {
      // 5. Se qualquer coisa der errado, pegamos o erro aqui
      res.status(400).json({ error: err.message });
      return;
    }
  }
}

export { ListProductIngredientsController };