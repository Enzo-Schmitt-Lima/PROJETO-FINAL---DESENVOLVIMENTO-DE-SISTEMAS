import { Request, Response } from "express";
import { ListPaymentsService } from "../../services/Pagamento/ListPaymentsService";

class ListPaymentsController {
    async handle(req: Request, res: Response): Promise<void> {
        try {
            const service = new ListPaymentsService();
            const payments = await service.execute();

            // Map metodo to string, ensure amount is number and add statusText + order info
            const statusTextMap: any = {
                0: "Pendente",
                1: "Pago",
                2: "Cancelado"
            };

            const orderStatusMap: any = {
                0: 'Em preparo',
                1: 'Em preparo',
                2: 'Pronto',
                3: 'Finalizado'
            };

            const mappedPayments = payments.map(payment => ({
                ...payment,
                method: this.mapMetodo(payment.metodo),
                amount: Number(payment.amount) || 0,
                statusText: statusTextMap[payment.status] || 'Desconhecido',
                orderStatusText: payment.order && typeof payment.order.status === 'number' ? orderStatusMap[payment.order.status] : undefined,
                orderFinalized: payment.order && payment.order.status === 3
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
