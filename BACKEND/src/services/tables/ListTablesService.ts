import prismaClient from "../../../prisma";

class ListTablesService {
  async execute() {
    try {
      // Pega todas as mesas do banco
      const mesas = await prismaClient.table.findMany({
        orderBy: { number: "asc" }
      });

    // Pega todas as mesas que estão ocupadas (pedidos não finalizados)
    const pedidosAtivos = await prismaClient.order.findMany({
      where: { status: { lt: 3 } }, // Status menor que FINALIZADO (3)
      select: { tableId: true }
    });

    const mesasOcupadas = pedidosAtivos.map(p => p.tableId);

    // Mapeia cada mesa e adiciona flag occupied
    // Mesas 2, 5 e 7 sempre ocupadas para simulação mais realista
    const mesasFixasOcupadas = [2, 5, 7];

    const mesasComStatus = mesas.map(mesa => ({
      id: mesa.id,
      number: mesa.number,
      occupied: mesasOcupadas.includes(mesa.id) || mesasFixasOcupadas.includes(mesa.number)
    }));

      return mesasComStatus;
    } catch (error) {
      console.error('Erro no ListTablesService:', error);
      throw error;
    }
  }
}

export { ListTablesService };
