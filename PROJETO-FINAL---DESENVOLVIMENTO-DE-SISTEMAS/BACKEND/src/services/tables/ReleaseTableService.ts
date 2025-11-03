import prismaClient from "../../../prisma";

class ReleaseTableService {
  async execute(tableId: number) {
    try {
      const result = await prismaClient.order.updateMany({
        where: {
          tableId: tableId,
          status: { lt: 3 },
        },
        data: {
          status: 3, // FINALIZADO
        },
      });

      return { message: 'Mesa liberada. Pedidos não finalizados foram marcados como finalizados.', updatedCount: result.count };
    } catch (err: any) {
      throw new Error(`Erro ao liberar mesa: ${err.message}`);
    }
  }
}

export { ReleaseTableService };
