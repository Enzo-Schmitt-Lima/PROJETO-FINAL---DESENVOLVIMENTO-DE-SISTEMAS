import prismaClient from "../../../prisma";

interface ProductIngredientsRequest {
  product_id: string;
}

class ListProductIngredientsService {
  async execute({ product_id }: ProductIngredientsRequest) {
    const product = await prismaClient.product.findUnique({
      where: {
        id: product_id,
      },
    });

    if (!product) {
      throw new Error("Produto não encontrado");
    }

    const ingredients = await prismaClient.produtoIngrediente.findMany({
      where: { produtoId: product_id },
      include: {
        ingrediente: true,
      },
    });

    const result = ingredients.map(item => ({
      id: item.id,
      ingrediente: item.ingrediente,
      adicionais: [],
    }));
    return result;
  }
}

export { ListProductIngredientsService };
