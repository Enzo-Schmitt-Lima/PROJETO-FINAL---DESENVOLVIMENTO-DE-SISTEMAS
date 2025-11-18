import prismaClient from "../../../prisma";

class GetProductService {
  async execute(id: string) {
    const product = await prismaClient.product.findUnique({
      where: {
        id: id,
      },
      include: {
        productIngrediente: {
          include: {
            ingrediente: true,
          },
        },
      },
    });
    return product;
  }
}

export { GetProductService };
