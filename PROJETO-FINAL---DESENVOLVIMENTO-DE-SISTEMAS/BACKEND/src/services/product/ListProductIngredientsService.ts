import prismaClient from "../../../prisma";

interface ProductIngredientsRequest {
  product_id: string;
}

class ListProductIngredientsService {
  async execute({ product_id }: ProductIngredientsRequest) {
    console.log("ListProductIngredientsService - product_id:", product_id);
    const ingredients = await prismaClient.produtoIngrediente.findMany({
      where: { produtoId: product_id },
      include: {
        ingrediente: true,
      },
    });
    console.log("ListProductIngredientsService - raw ingredients:", ingredients);

    const result = ingredients.map(item => ({
      id: item.id,
      ingrediente: item.ingrediente,
      adicionais: [],
    }));
    console.log("ListProductIngredientsService - mapped result:", result);
    return result;
  }
}

export { ListProductIngredientsService };
