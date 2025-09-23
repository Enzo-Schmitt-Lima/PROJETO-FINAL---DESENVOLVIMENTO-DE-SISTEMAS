import { Request, Response } from "express";
import { ListCategoryService } from "../../services/category/ListCategoryService";

class ListCategoryController {
  async handle(req: Request, res: Response) {
    const listCategoryService = new ListCategoryService();
    const categories = await listCategoryService.execute();

    // Garante que price vem como string formatada
    const formatted = categories.map((cat) => ({
      ...cat,
      products: cat.products.map((p: any) => ({
        ...p,
        price: Number(p.price).toFixed(2), // string "10.00"
      })),
    }));

    res.json(formatted);
  }
}

export { ListCategoryController };
