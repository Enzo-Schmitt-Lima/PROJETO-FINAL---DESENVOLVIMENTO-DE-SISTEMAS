import { Request, Response } from "express";
import { ListFeedbackService } from "../../services/Feedback/ListFeedbackService";

class ListFeedbackController {
  async handle(req: Request, res: Response): Promise<void> {
    try {
      const service = new ListFeedbackService();
      const result = await service.execute();

      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}

export { ListFeedbackController };
