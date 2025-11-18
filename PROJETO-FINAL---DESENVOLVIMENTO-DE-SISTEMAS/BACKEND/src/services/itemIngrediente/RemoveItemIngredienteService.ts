import prismaClient from "../../../prisma";

interface RemoveItemIngredienteRequest {
  item_id: string;
  ingrediente_id: string;
}

class RemoveItemIngredienteService {
  async execute({ item_id, ingrediente_id }: RemoveItemIngredienteRequest) {
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
