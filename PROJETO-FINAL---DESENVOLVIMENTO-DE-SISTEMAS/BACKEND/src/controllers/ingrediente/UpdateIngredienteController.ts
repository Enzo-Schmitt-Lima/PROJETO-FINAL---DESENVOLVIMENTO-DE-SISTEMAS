import { Request, Response } from "express";
import { UpdateIngredienteService } from "../../services/ingredientes/UpdateIngredienteService";

class UpdateIngredienteController {
    async handle(req: Request, res: Response) {
        const { ingrediente_id } = req.params;
        const { name } = req.body;

        const updateIngredienteService = new UpdateIngredienteService();

        const ingrediente = await updateIngredienteService.execute({
            ingrediente_id,
            name
        });

        return res.json(ingrediente);
    }
}

export { UpdateIngredienteController };
