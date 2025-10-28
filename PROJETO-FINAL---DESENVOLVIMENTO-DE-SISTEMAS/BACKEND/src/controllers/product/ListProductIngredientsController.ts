import { Request, Response } from "express";
import { ListProductIngredientsService } from "../../services/product/ListProductIngredientsService";

class ListProductIngredientsController {
  async handle(req: Request, res: Response) {
    const { product_id } = req.query as { product_id: string };

    const listProductIngredientsService = new ListProductIngredientsService();

    const ingredients = await listProductIngredientsService.execute({
      product_id,
    });

    res.json(ingredients);
  }
}

export { ListProductIngredientsController };
