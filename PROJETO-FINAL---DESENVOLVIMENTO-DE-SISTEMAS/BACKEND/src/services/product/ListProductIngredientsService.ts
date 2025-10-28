import prismaClient from "../../../prisma";

interface ProductIngredientsRequest {
  product_id: string;
}

class ListProductIngredientsService {
  async execute({ product_id }: ProductIngredientsRequest) {
    const productIngredients = await prismaClient.produtoIngrediente.findMany({
      where: { produtoId: product_id },
      include: {
        ingredientes: true,
        adicionais: true,
      },
    });

    return productIngredients;
  }
}

export { ListProductIngredientsService };
