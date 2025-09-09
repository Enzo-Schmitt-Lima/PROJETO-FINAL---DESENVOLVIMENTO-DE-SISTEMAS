import { Request, Response } from "express";
import { CreateCategoryService } from "../../services/category/CreateCategoryService";

class CreateCategoryController {
    async handle(req: Request, res: Response) {
        try {
            const { name } = req.body;

            const createCategoryService = new CreateCategoryService();
            const category = await createCategoryService.execute({ name });

             res.json(category);
        } catch (err) {
             res.status(400).json({ error: err.message });
        }
    }
}

export { CreateCategoryController };