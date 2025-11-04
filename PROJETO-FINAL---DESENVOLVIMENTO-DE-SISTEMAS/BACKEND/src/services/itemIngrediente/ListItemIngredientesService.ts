import prismaClient from "../../../prisma";

interface ListItemIngredientesRequest {
  item_id: string;
}

class ListItemIngredientesService {
  async execute({ item_id }: ListItemIngredientesRequest) {
    // Verifica se o item existe
    const item = await prismaClient.item.findUnique({
      where: { id: item_id },
      include: {
        ItemIngrediente: {
          include: {
            ingrediente: true,
          },
        },
      },
    });
    if (!item) throw new Error("Item não encontrado");

    return item.ItemIngrediente;
  }
}

export { ListItemIngredientesService };
