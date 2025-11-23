import prismaClient from "../../../prisma";

interface IngredienteRequest {
    ingrediente_id: string;
    name: string;
}

class UpdateIngredienteService {
    async execute({ ingrediente_id, name }: IngredienteRequest) {
        if (!ingrediente_id) {
            throw new Error("Ingrediente ID is required");
        }

        const ingrediente = await prismaClient.ingredientes.update({
            where: {
                id: ingrediente_id,
            },
            data: {
                name: name,
            },
        });

        return ingrediente;
    }
}

export { UpdateIngredienteService };
