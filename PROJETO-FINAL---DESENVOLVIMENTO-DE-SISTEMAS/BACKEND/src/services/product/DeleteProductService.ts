import prismaClient from "../../../prisma";

interface DeleteProductRequest {
  product_id: string;
}

class DeleteProductService {
  async execute({ product_id }: DeleteProductRequest) {
    try {
      const result = await prismaClient.$transaction(async (prisma) => {
        // 1. Delete related ItemIngrediente records
        await prisma.itemIngrediente.deleteMany({
          where: {
            item: {
              product_id: product_id,
            },
          },
        });

        // 2. Delete related ItemAdicional records
        await prisma.itemAdicional.deleteMany({
          where: {
            items: {
              product_id: product_id,
            },
          },
        });

        // 3. Delete related Item records
        await prisma.item.deleteMany({
          where: {
            product_id: product_id,
          },
        });

        // 4. Delete related ProdutoIngrediente records
        await prisma.produtoIngrediente.deleteMany({
          where: {
            produtoId: product_id,
          },
        });

        // 5. Finally, delete the product itself
        const product = await prisma.product.delete({
          where: {
            id: product_id,
          },
        });

        return product;
      });

      return result;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw new Error("Failed to delete product and its associations.");
    }
  }
}

export { DeleteProductService };
