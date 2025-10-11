import prismaClient from "../../../prisma";

class ClearDraftOrdersService {
  async execute() {
    try {
      // Remove todos os pedidos em draft
      const deletedOrders = await prismaClient.order.deleteMany({
        where: { draft: true }
      });

      // Define status FINALIZADO para todos os pedidos ativos (status = false)
      const updatedOrders = await (prismaClient.order as any).updateMany({
        where: { status: false },
        data: { status: true }
      });

      return {
        message: "Pedidos em rascunho removidos e pedidos ativos finalizados com sucesso",
        deletedCount: deletedOrders.count,
        updatedCount: updatedOrders.count
      };
    } catch (error) {
      throw new Error(`Erro ao limpar pedidos: ${error.message}`);
    }
  }
}

export { ClearDraftOrdersService };
