import { Request, Response } from "express";
import { CreateAdicionalService } from "../../services/Adicionais/CreateAdicionalService";

class CreateAdicionalController {
    async handle(req: Request, res: Response) {
        try {
            const { name, price } = req.body;

            const createAdicionalService = new CreateAdicionalService();
            const adicional = await createAdicionalService.execute({ name, price });

            res.json(adicional);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}

export { CreateAdicionalController };