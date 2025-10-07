import prismaClient from "../../../prisma";

class ClearDraftOrdersService {
  async execute() {
    // Remove todos os pedidos em draft (não finalizados)
    const deletedOrders = await prismaClient.order.deleteMany({
      where: { draft: true }
    });

    // Também remove os itens associados aos pedidos em draft
    // (isso é feito automaticamente pelo Prisma devido às foreign keys)

    return {
      message: "Pedidos em rascunho removidos com sucesso",
      deletedCount: deletedOrders.count
    };
  }
}

export { ClearDraftOrdersService };
