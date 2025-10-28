// ...existing code...
import prismaClient from "../../../prisma";

export class CreateAdicionalService {
    async execute(data: { name: string; price: number;  }) {
        const { name, price} = data;

        if (!name) throw new Error("Name is required");
        if (price === undefined || price === null) throw new Error("Price is required");

        const adicional = await prismaClient.adicionais.create({
            data: {
                name,
                price,
            },
            select: {
                id: true,
                name: true,
                price: true,
            },
        });

        return adicional;
    }
}
// ...existing code...

