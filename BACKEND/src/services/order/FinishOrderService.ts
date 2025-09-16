import prismaClient from "../../../prisma";

interface OrderRequest {
    order_id: string;
}

class FinishOrderService{
    async execute({ order_id }: OrderRequest){

        const order = await prismaClient.order.update({
            where:{
                id: order_id
            },
            data:{
                status: 3,
            }
        })


        return order;
    }
}

export { FinishOrderService }