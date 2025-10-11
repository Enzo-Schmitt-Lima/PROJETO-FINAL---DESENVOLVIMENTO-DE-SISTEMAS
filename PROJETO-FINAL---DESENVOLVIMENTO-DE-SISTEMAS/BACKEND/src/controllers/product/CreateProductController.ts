import { Request, Response } from "express"
import { CreateProductService } from "../../services/product/CreateProductService"


class CreateProductController {
    async handle(req: Request, res: Response): Promise<void> {
        try {
            const { name, price, description, category_id } = req.body;

            const createProductService = new CreateProductService();

            if (!req.file) {
                res.status(400).json({ error: "Arquivo de imagem é obrigatório" });
                return;
            }

            const { originalname, filename: banner } = req.file;

            const product = await createProductService.execute({
                name,
                price,
                description,
                banner,
                category_id
            });

            res.json(product);
        } catch (error: any) {
            console.error("Erro ao criar produto:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

}

export { CreateProductController }