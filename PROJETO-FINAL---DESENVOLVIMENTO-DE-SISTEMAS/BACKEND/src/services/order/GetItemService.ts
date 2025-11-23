import prismaClient from "../../../prisma";

interface GetItemRequest {
    id: string;
}

class GetItemService {
    async execute({ id }: GetItemRequest) {
        try {
            const item = await prismaClient.item.findUnique({
                where: { id },
                include: {
                    product: true,
                    ItemIngrediente: {
                        include: {
                            ingrediente: true,
                        },
                    },
                },
            });

            if (!item) {
                throw new Error("Item não encontrado");
            }

            return item;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export { GetItemService };
