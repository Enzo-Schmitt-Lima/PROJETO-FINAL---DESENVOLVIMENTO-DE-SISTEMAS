import prismaClient from "../../../prisma";

class OrphanCheckService {
  async execute() {
    // ProdutoIngrediente entries that reference a non-existing product
    const produtoOrphans = await prismaClient.$queryRawUnsafe(
      `SELECT pi.* FROM "ProdutoIngrediente" pi LEFT JOIN products p ON p.id = pi."produtoId" WHERE p.id IS NULL`
    );

    // Items that reference a non-existing product
    const itemOrphans = await prismaClient.$queryRawUnsafe(
      `SELECT i.* FROM items i LEFT JOIN products p ON p.id = i.product_id WHERE p.id IS NULL`
    );

    return {
      produtoOrphans: produtoOrphans as any[],
      itemOrphans: itemOrphans as any[],
    };
  }
}

export { OrphanCheckService };
