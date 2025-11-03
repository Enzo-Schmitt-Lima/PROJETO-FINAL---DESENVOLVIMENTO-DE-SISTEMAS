import prismaClient from "../../../prisma";

class GetProductService {
  async execute(id: string) {
    const product = await prismaClient.product.findUnique({
      where: {
        id: id
      }
    });
    return product;
  }
}

export { GetProductService };
