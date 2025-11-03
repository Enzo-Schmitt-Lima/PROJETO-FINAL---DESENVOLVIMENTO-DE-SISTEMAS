import prismaClient from "../../../prisma";

interface AddIngredientRequest {
  product_id: string;
  ingredient_id: string;
}

class AddIngredientToProductService {
  async execute({ product_id, ingredient_id }: AddIngredientRequest) {
    // Check if the ingredient is already added to the product
    const existingIngredient = await prismaClient.produtoIngrediente.findFirst({
      where: {
        produtoId: product_id,
        ingredienteId: ingredient_id,
      },
    });

    if (existingIngredient) {
      throw new Error("Ingredient already added to this product");
    }

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
