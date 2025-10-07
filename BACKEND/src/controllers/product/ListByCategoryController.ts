import { Request, Response } from "express";
import { ListByCategoryService } from "../../services/product/ListByCategoryService";

class ListByCategoryController {
    async handle(req: Request, res: Response) {
        const category_id = req.query.category_id as string;
        const listByCategory = new ListByCategoryService();
        const products = await listByCategory.execute({ category_id });

        // Adiciona URL completa da imagem
        const formattedProducts = products.map((product) => ({
            ...product,
            price: Number(product.price).toFixed(2),
            bannerUri: product.banner
                ? `${req.protocol}://${req.get('host')}/files/${product.banner}`
                : null,
        }));

        res.json(formattedProducts);
    }
}

export { ListByCategoryController };
