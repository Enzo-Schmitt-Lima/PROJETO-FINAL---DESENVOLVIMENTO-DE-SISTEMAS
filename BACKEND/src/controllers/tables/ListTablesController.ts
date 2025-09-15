import { Request, Response } from "express";
import prismaClient from "../../../prisma";

class ListTablesController {
  async handle(req: Request, res: Response) {
    const orders = await prismaClient.order.findMany({
      where: { draft: true },
      select: { tableId: true }
    });

    const mesasOcupadas = orders.map(o => o.tableId);
    const todasMesas = Array.from({ length: 20 }, (_, i) => i + 1);
    
    const mesasDisponiveis = todasMesas
      .filter(number => !mesasOcupadas.includes(number))
      .map(number => ({ id: number, number })); // transforma em objeto

    res.json(mesasDisponiveis);
  }
}

export { ListTablesController };
