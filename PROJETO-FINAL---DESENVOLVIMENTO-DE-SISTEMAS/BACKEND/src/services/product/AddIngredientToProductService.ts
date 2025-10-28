import prismaClient from "../../../prisma";

interface AddIngredientRequest {
  product_id: string;
  ingredient_id: string;
}

class AddIngredientToProductService {
  async execute({ product_id, ingredient_id }: AddIngredientRequest) {
    const productIngredient = await prismaClient.produtoIngrediente.create({
      data: {
        produtoId: product_id,
        ingredienteId: ingredient_id,
      },
      include: {
        ingredientes: true,
      },
    });

    return productIngredient;
  }
}

export { AddIngredientToProductService };
