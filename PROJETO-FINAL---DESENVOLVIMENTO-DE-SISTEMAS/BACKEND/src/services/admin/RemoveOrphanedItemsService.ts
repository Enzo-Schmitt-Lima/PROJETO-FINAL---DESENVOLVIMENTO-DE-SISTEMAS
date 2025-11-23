import prismaClient from "../../../prisma";

class RemoveOrphanedItemsService {
  async execute() {
    // First, get the orphans
    const produtoOrphans = await prismaClient.$queryRawUnsafe(
      `SELECT pi.id FROM "ProdutoIngrediente" pi LEFT JOIN products p ON p.id = pi."produtoId" WHERE p.id IS NULL`
    ) as { id: string }[];

    const itemOrphans = await prismaClient.$queryRawUnsafe(
      `SELECT i.id FROM items i LEFT JOIN products p ON p.id = i.product_id WHERE p.id IS NULL`
    ) as { id: string }[];

    // Delete ProdutoIngrediente orphans
    if (produtoOrphans.length > 0) {
      const ids = produtoOrphans.map(o => o.id);
      await prismaClient.produtoIngrediente.deleteMany({
        where: { id: { in: ids } }
      });
    }

    // Delete item orphans
    if (itemOrphans.length > 0) {
      const ids = itemOrphans.map(o => o.id);
      await prismaClient.item.deleteMany({
        where: { id: { in: ids } }
      });
    }

    return {
      deletedProdutoOrphans: produtoOrphans.length,
      deletedItemOrphans: itemOrphans.length,
    };
  }
}

export { RemoveOrphanedItemsService };
