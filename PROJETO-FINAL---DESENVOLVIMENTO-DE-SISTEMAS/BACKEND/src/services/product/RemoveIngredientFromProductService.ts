import prismaClient from "../../../prisma";

interface RemoveIngredientRequest {
  product_id: string;
  ingredient_id: string;
}

class RemoveIngredientFromProductService {
  async execute({ product_id, ingredient_id }: RemoveIngredientRequest) {
    const productIngredient = await prismaClient.produtoIngrediente.deleteMany({
      where: {
        produtoId: product_id,
        ingredienteId: ingredient_id,
      },
    });

    return productIngredient;
  }
}

export { RemoveIngredientFromProductService };
