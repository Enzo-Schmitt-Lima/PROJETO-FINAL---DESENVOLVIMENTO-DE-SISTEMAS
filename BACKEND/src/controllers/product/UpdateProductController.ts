import { Request, Response } from "express";
import { UpdateProductService } from "../../services/product/UpdateProductService";

export class UpdateProductController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { name, description, price, category_id } = req.body;

    // imagem vem do multer
    const banner = req.file?.filename;

    const service = new UpdateProductService();

    try {
      const updatedProduct = await service.execute({
        id,
        name,
        description,
        price,
        banner,
        category_id,
      });

      res.status(200).json(updatedProduct);
    } catch (err: any) {
      console.error("Erro ao atualizar produto:", err);
      res.status(500).json({ error: "Erro ao atualizar produto" });
    }
  }
}
