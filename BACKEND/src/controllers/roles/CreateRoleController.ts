import { Request, Response } from "express";
import { CreateRoleService } from "../../services/roles/CreateRoleService";

class CreateRoleController {
  async handle(req: Request, res: Response) {
    const { name } = req.body;

    try {
      const service = new CreateRoleService();
      const role = await service.execute({ name });
      res.json(role);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}

export { CreateRoleController };
