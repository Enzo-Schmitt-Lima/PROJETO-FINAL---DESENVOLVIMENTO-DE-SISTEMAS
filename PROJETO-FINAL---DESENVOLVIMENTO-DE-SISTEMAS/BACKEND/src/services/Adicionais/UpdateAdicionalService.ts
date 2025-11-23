import prismaClient from "../../../prisma";

interface AdicionalRequest {
    adicional_id: string;
    name: string;
    price: number;
}

class UpdateAdicionalService {
    async execute({ adicional_id, name, price }: AdicionalRequest) {
        if (!adicional_id) {
            throw new Error("Adicional ID is required");
        }

        const adicional = await prismaClient.adicionais.update({
            where: {
                id: adicional_id,
            },
            data: {
                name: name,
                price: price,
            },
        });

        return adicional;
    }
}

export { UpdateAdicionalService };
