import prismaClient from "../../../prisma";

class ListTablesService {
  async execute() {
    const tables = await prismaClient.table.findMany({
      orderBy: { number: "asc" } 
    });

    return tables;
  }
}

export { ListTablesService };
