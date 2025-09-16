import { Request, Response } from "express";
import { ListIngredienteService } from "../../services/ingredientes/ListIngredienteService";

class ListIngredienteController{
    async handle(req: Request, res: Response){

        const listIngredienteService = new ListIngredienteService();

        const ingrediente = await listIngredienteService.execute();

        res.json(ingrediente);

    }
}

export { ListIngredienteController }