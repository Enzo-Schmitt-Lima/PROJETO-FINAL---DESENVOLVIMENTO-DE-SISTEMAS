import { Request, Response } from "express";
import { CreateIngredienteService } from "../../services/ingredientes/CreateIngredientesService";

class CreateIngredienteController {
    async handle(req: Request, res: Response) {
        try {
            const { name } = req.body;

            const createingredienteService = new CreateIngredienteService();
            const ingrediente = await createingredienteService.execute({ name });

             res.json(ingrediente);
        } catch (err) {
             res.status(400).json({ error: err.message });
        }
    }
}

export { CreateIngredienteController };