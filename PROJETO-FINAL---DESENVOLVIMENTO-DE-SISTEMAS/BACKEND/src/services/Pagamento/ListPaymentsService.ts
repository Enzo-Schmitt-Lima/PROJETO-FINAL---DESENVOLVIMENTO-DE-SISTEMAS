import prismaClient from "../../../prisma";

class ListPaymentsService {
    async execute() {
        const payments = await prismaClient.pagamento.findMany({
            include: {
                order: {
                    include: {
                        items: {
                            include: {
                                product: true
                            }
                        },
                        table: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        return payments;
    }
}

export { ListPaymentsService }
