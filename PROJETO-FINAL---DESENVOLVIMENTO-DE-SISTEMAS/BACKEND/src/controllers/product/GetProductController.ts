import { Request, Response } from "express";
import { GetProductService } from "../../services/product/GetProductService";

class GetProductController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;

    const getProductService = new GetProductService();

    try {
      const product = await getProductService.execute(id);
      
      // Se o service encontrar, ele retorna o produto
      return response.json(product);

    } catch (error: any) { // Mudança leve: 'any' para pegar a .message
      console.log("Erro ao buscar produto:", error.message);
      
      // Se o service jogar um erro, o controller captura aqui
      // E avisa o frontend que deu erro
      return response.status(404).json({ error: error.message });
    }
  }
}

export { GetProductController };