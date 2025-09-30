import { Request, Response } from "express";
import { AddItemService } from "../../services/order/AddItemService";

class AddItemController {
    async handle(req: Request, res: Response){
        console.log('AddItemController chamado com:', req.body);
        const { order_id, items } = req.body;

        const addItem = new AddItemService();
        const results = [];

        for (const item of items) {
            const result = await addItem.execute({
                order_id,
                product_id: item.product_id,
                amount: item.amount
            });
            results.push(result);
        }

        res.json({ success: true, results });
    }
}

export { AddItemController }