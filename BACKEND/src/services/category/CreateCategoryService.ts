import prismaClient from "../../../prisma";
interface CategoryRequest {
    name: string;
    parentId?: string;
}

class CreateCategoryService {
    async execute({ name, parentId }: CategoryRequest) {

        if (!name || name.trim() === '') {
            throw new Error('Name invalid');
        }
        
        if (parentId) {
            const parentExists = await prismaClient.category.findUnique({
                where: { id: parentId },
            });

            if (!parentExists) {
                throw new Error('Categoria pai não encontrada');
            }
        }
       
        const category = await prismaClient.category.create({
            data: {
                name,
                parentId: parentId || null, 
            },
            select: {
                id: true,
                name: true,
                parentId: true,
            },
        });

        return category;
    }
}

export { CreateCategoryService };
