import prismaClient from "../../../prisma";

class ListProductsWithIngredientsService {
    async execute() {
        const productIds = await prismaClient.produtoIngrediente.findMany({
            select: { produtoId: true },
            distinct: ['produtoId'],
        });

        const ids = productIds.map(p => p.produtoId);

        const products = await prismaClient.product.findMany({
            where: { id: { in: ids } },
            include: {
                category: true,
                productIngrediente: {
                    include: {
                        ingrediente: true,
                    },
                },
            },
        });

        return products;
    }
}

export { ListProductsWithIngredientsService };
