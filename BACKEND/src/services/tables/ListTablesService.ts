import prismaClient from "../../../prisma";

class ListTablesService {
  async execute() {
    try {
      // Pega todas as mesas do banco
      const mesas = await prismaClient.table.findMany({
        orderBy: { number: "asc" }
      });

      // Pega todas as mesas que estão ocupadas (pedidos em draft)
      const pedidosDraft = await prismaClient.order.findMany({
        where: { draft: true },
        select: { tableId: true }
      });

      const mesasOcupadas = pedidosDraft.map(p => p.tableId);

      // Mapeia cada mesa e adiciona flag occupied
      const mesasComStatus = mesas.map(mesa => ({
        id: mesa.id,
        number: mesa.number,
        occupied: mesasOcupadas.includes(mesa.id)
      }));

      return mesasComStatus;
    } catch (error) {
      console.error('Erro no ListTablesService:', error);
      throw error;
    }
  }
}

export { ListTablesService };
