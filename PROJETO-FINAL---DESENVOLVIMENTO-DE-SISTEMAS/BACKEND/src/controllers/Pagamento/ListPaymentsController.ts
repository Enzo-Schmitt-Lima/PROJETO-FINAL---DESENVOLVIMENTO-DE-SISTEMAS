import { Request, Response } from "express";
import { ListPaymentsService } from "../../services/Pagamento/ListPaymentsService";

class ListPaymentsController {
    async handle(req: Request, res: Response): Promise<void> {
        try {
            const service = new ListPaymentsService();
            const payments = await service.execute();

            // Map metodo to string and ensure amount is number
            const mappedPayments = payments.map(payment => ({
                ...payment,
                method: this.mapMetodo(payment.metodo),
                amount: Number(payment.amount) || 0
            }));

            res.json(mappedPayments);
        } catch (err) {
            console.error("Erro ao listar pagamentos:", err);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    private mapMetodo(metodo: number): string {
        const MapMetodo = {
            0: "Pix",
            1: "Crédito",
            2: "Débito",
            3: "Dinheiro físico (pagar com o garçom)"
        };
        return MapMetodo[metodo as keyof typeof MapMetodo] || "Desconhecido";
    }
}

export { ListPaymentsController }
