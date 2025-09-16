import prismaClient from "../../../prisma";
import { StatusPedido } from "../../controllers/order/UpdateStatusPedidoController";

class ListOrdersService{
    async execute() {

        const orders = await prismaClient.order.findMany({
            where: {
                draft: true,
                status: { in: [StatusPedido.INDO_PREPARO, StatusPedido.PREPARANDO] },
            },
            orderBy:{
                created_at: 'desc'
            }
        })

        return orders;

    }
}

export { ListOrdersService }