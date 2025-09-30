import prismaClient from "../../../prisma";
import { PagamentoStatus } from "../../controllers/Pagamento/StatusPedidoController";

// Interface para receber dados
interface UpdatePaymentStatusRequest {
  pagamento_id: string;
  status: PagamentoStatus;
}

class UpdatePagamentoStatusService {
  async execute({ pagamento_id, status }: UpdatePaymentStatusRequest) {
    // busca pagamento
    const pagamento = await prismaClient.pagamento.findUnique({
      where: { id: pagamento_id },
    });

    if (!pagamento) throw new Error("Pagamento não encontrado");

    // atualiza status
    const updatedPayment = await prismaClient.pagamento.update({
      where: { id: pagamento_id },
      data: { status },
    });

    if (status === PagamentoStatus.PAID) {
      // Verifica se o pedido existe antes de atualizar
      const orderExists = await prismaClient.order.findUnique({
        where: { id: pagamento.order_id },
      });
      if (!orderExists) {
        throw new Error('Pedido não encontrado para atualização de status.');
      }
      await prismaClient.order.update({
        where: { id: pagamento.order_id },
        data: { status: 3 }, // FINALIZADO
      });
    }

    // retorna status legível
    const statusTextMap = {
      [PagamentoStatus.PENDING]: "Pendente",
      [PagamentoStatus.PAID]: "Pago",
      [PagamentoStatus.CANCELLED]: "Cancelado",
    };

    return {
      ...updatedPayment,
      statusText: statusTextMap[status],
    };
  }
}

export { UpdatePagamentoStatusService };
