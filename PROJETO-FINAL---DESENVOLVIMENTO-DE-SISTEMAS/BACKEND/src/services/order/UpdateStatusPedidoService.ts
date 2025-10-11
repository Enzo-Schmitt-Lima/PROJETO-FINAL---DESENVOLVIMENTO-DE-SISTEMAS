import prismaClient from "../../../prisma";
import { StatusPedido } from "./FinishOrderService";

interface UpdateStatusPedidoRequest {
  id: string;
  status: StatusPedido;
}

class UpdateStatusPedidoService {
  async execute({ id, status }: UpdateStatusPedidoRequest) {
    // Primeiro verifica se existe
    const orderExist = await prismaClient.order.findUnique({ where: { id } });
    if (!orderExist) {
      throw new Error("Pedido não encontrado");
    }

    const pedido = await prismaClient.order.update({
      where: { id },
      data: { status },
    });

    return {
      ...pedido,
      statusText: StatusPedido[status],
    };
  }
}

export { UpdateStatusPedidoService };
