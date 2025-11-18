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

    // ----- CORREÇÃO APLICADA -----
    // Se o produto não for encontrado (product for null),
    // nós jogamos um erro.
    if (!product) {
      throw new Error("Produto não encontrado.");
    }
    // ----------------------------

    // Se o código chegou aqui, o produto foi encontrado e será retornado.
    return product;
  }
}

export { GetProductService };