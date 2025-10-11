import prismaClient from "../../../prisma";

class CreateTablesService {
  async execute() {
    const existingTables = await prismaClient.table.findMany();
    if (existingTables.length > 0) {
      return existingTables;
    }

    const tablesData = Array.from({ length: 20 }, (_, i) => ({
      number: i + 1,
    }));

    const tables = await prismaClient.table.createMany({
      data: tablesData,
      skipDuplicates: true,
    });

    return tablesData;
  }
}

export { CreateTablesService };
