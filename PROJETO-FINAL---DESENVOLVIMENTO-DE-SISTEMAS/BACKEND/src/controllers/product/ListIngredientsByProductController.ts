import { Request, Response } from 'express';
import { ListIngredientsByProductService } from '../../services/product/ListIngredientsByProductService';

class ListIngredientsByProductController {
  async handle(request: Request, response: Response) {
    const product_id = request.query.product_id as string;

    const listIngredientsByProduct = new ListIngredientsByProductService();

    const ingredients = await listIngredientsByProduct.execute({
      product_id,
    });

    return response.json(ingredients);
  }
}

export { ListIngredientsByProductController };
