import { Response, Request } from "express";
import { ListAdicionalService } from "../../services/Adicionais/ListAdicionalService";

class ListAdicionalController{
    async handle(request: Request, res: Response){ 

        const listAdicionalService = new ListAdicionalService();

        const adicional = await listAdicionalService.execute();

        res.json(adicional);
    }
}

export { ListAdicionalController }

