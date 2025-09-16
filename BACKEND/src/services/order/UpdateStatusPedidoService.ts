import prismaClient from "../../../prisma";
import { StatusPedido } from "../../controllers/order/UpdateStatusPedidoController";

interface UpdateStatusPedidoRequest {
  id: string;
  status: StatusPedido;
}

class UpdateStatusPedidoService {
  async execute({ id, status }: UpdateStatusPedidoRequest) {
    const pedido = await prismaClient.order.update({
      where: { id },
      data: { status },
    });

    // trasnforma o número do status no texto escrito no enum
    return {
      ...pedido,
      statusText: StatusPedido[status], 
    };
  }
}

export { UpdateStatusPedidoService };
