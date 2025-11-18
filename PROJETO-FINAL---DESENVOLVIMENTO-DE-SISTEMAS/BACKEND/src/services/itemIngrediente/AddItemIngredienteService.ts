import prismaClient from "../../../prisma";

interface AddItemIngredienteRequest {
  item_id: string;
  ingrediente_id: string;
}

class AddItemIngredienteService {
  async execute({ item_id, ingrediente_id }: AddItemIngredienteRequest) {
    // Verifica se o item existe
    const item = await prismaClient.item.findUnique({
      where: { id: item_id },
    });
    if (!item) throw new Error("Item não encontrado");

    // Verifica se o ingrediente existe
    const ingrediente = await prismaClient.ingredientes.findUnique({
      where: { id: ingrediente_id },
    });
    if (!ingrediente) throw new Error("Ingrediente não encontrado");

    // Verifica se já existe uma customização para este ingrediente no item
    const existingCustomization = await prismaClient.itemIngrediente.findFirst({
      where: {
        itemId: item_id,
        ingredienteId: ingrediente_id,
      },
    });

    if (existingCustomization) {
      // Se existe, apenas marca como não removido
      await prismaClient.itemIngrediente.update({
        where: { id: existingCustomization.id },
        data: { removed: false },
      },
      );
    } else {
      // Se não existe, cria uma nova customização
      await prismaClient.itemIngrediente.create({
        data: {
          itemId: item_id,
          ingredienteId: ingrediente_id,
          removed: false, // Por padrão, ao adicionar, não está removido
        },
      });
    }
    return { message: "Ingrediente adicionado com sucesso" };
  }
}

export { AddItemIngredienteService };
