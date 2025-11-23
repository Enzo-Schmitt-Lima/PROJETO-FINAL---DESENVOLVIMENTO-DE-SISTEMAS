import { Request, Response } from "express";
import { RemoveOrphanedItemsService } from "../../services/admin/RemoveOrphanedItemsService";

class RemoveOrphanedItemsController {
  async handle(request: Request, response: Response) {
    const removeOrphanedItemsService = new RemoveOrphanedItemsService();

    try {
      const result = await removeOrphanedItemsService.execute();
      return response.json({ message: "Orphaned items removed successfully", ...result });
    } catch (error: any) {
      console.log("Erro ao remover itens órfãos:", error.message);
      return response.status(500).json({ error: error.message });
    }
  }
}

export { RemoveOrphanedItemsController };
