import prismaClient from "../../../prisma";

class ListCategoryService {
  async execute() {
    const categories = await prismaClient.category.findMany({
      select: {
        id: true,
        name: true,
        products: {
          select: {
            id: true,
            name: true,
            price: true, // continua string
            banner: true,
            description: true,
          },
        },
      },
    });

    return categories;
  }
}

export { ListCategoryService };
