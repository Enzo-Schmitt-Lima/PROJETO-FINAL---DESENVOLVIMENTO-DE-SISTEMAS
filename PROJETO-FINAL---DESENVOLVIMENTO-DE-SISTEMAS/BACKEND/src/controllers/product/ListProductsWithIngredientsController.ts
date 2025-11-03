import { Request, Response } from "express";
import { ListProductsWithIngredientsService } from "../../services/product/ListProductsWithIngredientsService";

class ListProductsWithIngredientsController {
  async handle(req: Request, res: Response): Promise<void> {
    try {
      const service = new ListProductsWithIngredientsService();
      const products = await service.execute();

      res.json(products);
    } catch (err: any) {
      console.error("ListProductsWithIngredientsController error:", err.message || err);
      res.status(500).json({ error: "Erro interno" });
    }
  }
}

export { ListProductsWithIngredientsController };
