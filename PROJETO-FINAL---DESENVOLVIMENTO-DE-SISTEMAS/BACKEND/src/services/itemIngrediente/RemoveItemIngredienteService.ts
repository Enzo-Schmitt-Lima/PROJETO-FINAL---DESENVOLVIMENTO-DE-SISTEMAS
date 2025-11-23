import prismaClient from "../../../prisma";

interface RemoveItemIngredienteRequest {
  item_id: string;
  ingrediente_id: string;
}

class RemoveItemIngredienteService {
  async execute({ item_id, ingrediente_id }: RemoveItemIngredienteRequest) {
    // Verifica se o item existe e inclui a categoria do produto
    const item = await prismaClient.item.findUnique({
      where: { id: item_id },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!item) {
      throw new Error("Item não encontrado");
    }

    // Verifica se a categoria do produto permite manipulação de ingredientes
    const allowedCategories = ["Pizzas Clássicas", "Pizzas Especiais"];
    if (!allowedCategories.includes(item.product.category.name)) {
      throw new Error("Ingredientes só podem ser modificados em pizzas.");
    }

    // Procura por uma customização existente para este item e ingrediente
    const existingCustomization = await prismaClient.itemIngrediente.findFirst({
      where: {
        itemId: item_id,
        ingredienteId: ingrediente_id,
      },
    });

    if (existingCustomization) {
      // Se já existe um registro, atualiza para 'removido: true'
      await prismaClient.itemIngrediente.update({
        where: { id: existingCustomization.id },
        data: { removed: true },
      });
    } else {
      // Se não existe, cria um novo registro já marcado como 'removido: true'
      await prismaClient.itemIngrediente.create({
        data: {
          itemId: item_id,
          ingredienteId: ingrediente_id,
          removed: true,
        },
      });
    }

    return { message: "Ingrediente removido com sucesso" };
  }
}

export { RemoveItemIngredienteService };
