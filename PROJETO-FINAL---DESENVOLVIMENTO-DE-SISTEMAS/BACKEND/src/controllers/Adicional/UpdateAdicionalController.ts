import { Request, Response } from "express";
import { UpdateAdicionalService } from "../../services/Adicionais/UpdateAdicionalService";

class UpdateAdicionalController {
    async handle(req: Request, res: Response) {
        const { adicional_id } = req.params;
        const { name, price } = req.body;

        const updateAdicionalService = new UpdateAdicionalService();

        const adicional = await updateAdicionalService.execute({
            adicional_id,
            name,
            price
        });

        return res.json(adicional);
    }
}

export { UpdateAdicionalController };
