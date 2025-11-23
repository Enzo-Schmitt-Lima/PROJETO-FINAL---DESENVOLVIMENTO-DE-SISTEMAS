import { Request, Response } from "express";
import { AddItemService } from "../../services/order/AddItemService";

class AddItemController {
    async handle(req: Request, res: Response){
        console.log('AddItemController payload:', req.body);

        const { order_id, customizations } = req.body;
        const items = req.body.items as Array<{ product_id: string; amount: number; customizations?: any[] }> | undefined;
        const singleProductId = req.body.product_id as string | undefined;
        const singleAmount = req.body.amount as number | undefined;

        const addItem = new AddItemService();

        try {
            if (items && Array.isArray(items) && items.length > 0) {
                const results = [] as any[];
                for (const it of items) {
                    console.log('Processing item in array:', it);
                    const r = await addItem.execute({ order_id, product_id: it.product_id, amount: it.amount, customizations: it.customizations });
                    results.push(r);
                }
                console.log('AddItemController results for array:', results);
                return res.json({ items: results });
            }

            if (singleProductId) {
                const result = await addItem.execute({ order_id, product_id: singleProductId, amount: singleAmount || 1, customizations });
                console.log('AddItemController result (single):', result);
                return res.json(result);
            }

            console.log('AddItemController: nenhum item válido no payload');
            return res.status(400).json({ error: 'Nenhum item fornecido' });
        } catch (err: any) {
            console.error('Erro em AddItemController:', err);
            return res.status(500).json({ error: err.message || 'Erro ao adicionar item' });
        }
    }
}

export { AddItemController }