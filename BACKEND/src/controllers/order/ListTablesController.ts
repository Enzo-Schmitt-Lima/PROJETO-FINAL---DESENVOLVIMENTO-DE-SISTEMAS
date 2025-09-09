import { Request, Response } from "express";
import prismaClient from "../../../prisma";

class ListTablesController {
  async handle(req: Request, res: Response) {
    const orders = await prismaClient.order.findMany({
      where: {
        draft: true,
      },
      select: {
        table: true,
      },
    });

    const mesasOcupadas = orders.map((o) => o.table);
    const todasMesas = Array.from({ length: 20 }, (_, i) => i + 1); 
    const mesasDisponiveis = todasMesas.filter((m) => !mesasOcupadas.includes(m));

    res.json(mesasDisponiveis);
  }
}

export { ListTablesController };
