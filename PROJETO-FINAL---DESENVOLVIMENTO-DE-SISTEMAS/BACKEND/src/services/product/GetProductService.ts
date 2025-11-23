import prismaClient from "../../../prisma";

class GetProductService {
  async execute(id: string) {
    const product = await prismaClient.product.findUnique({
      where: { id },
      include: {
        category: true,
        productIngrediente: {
          include: {
            ingrediente: true,
          },
        },
      },
    });

    if (!product) {
      throw new Error("Produto não encontrado.");
    }

    return product;
  }
}

export { GetProductService };