import { Request, Response } from "express";
import { ListProductIngredientsService } from "../../services/product/ListProductIngredientsService";

class ListProductIngredientsController {
  async handle(req: Request, res: Response): Promise<void> {
    const { product_id } = req.query as { product_id: string };
    console.log("ListProductIngredientsController - product_id:", product_id);

    try {
      const service = new ListProductIngredientsService();
      const ingredients = await service.execute({ product_id });
      console.log("ListProductIngredientsController - ingredients:", ingredients);

      res.json(ingredients);
    } catch (err: any) {
      console.error("ListProductIngredientsController error:", err.message || err);
      if (err.message === "Produto não encontrado") {
        res.status(404).json({ error: err.message });
      } else {
        res.status(500).json({ error: "Erro interno" });
      }
    }
  }
}

export { ListProductIngredientsController };
