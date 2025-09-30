import { Request, Response } from "express";
import { CreateProdutoIngredienteService } from "../../services/ProdutoIngrediente/CreateProductIngredienteService";

class CreateProdutoIngredienteController {
  async handle(req: Request, res: Response) {
    try {
      const { produtoId, ingredienteId } = req.body;

      if (!produtoId || !ingredienteId) {
        return res.status(400).json({
          error: "produtoId e ingredienteId são obrigatórios",
        });
      }

      const service = new CreateProdutoIngredienteService();
      const relacao = await service.execute({ produtoId, ingredienteId });

      return res.json(relacao);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { CreateProdutoIngredienteController };
