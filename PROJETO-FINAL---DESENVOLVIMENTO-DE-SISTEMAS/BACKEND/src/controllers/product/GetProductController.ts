import { Request, Response } from "express";
import { GetProductService } from "../../services/product/GetProductService";

class GetProductController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;

    const getProductService = new GetProductService();

    try {
      const product = await getProductService.execute(id);

      response.json(product);
    } catch (error) {
      console.log("Erro ao buscar produto:", error);
      response.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}

export { GetProductController };
