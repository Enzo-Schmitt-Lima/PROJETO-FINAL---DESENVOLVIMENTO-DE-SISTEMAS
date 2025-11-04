import { Request, Response } from "express";
import { CreateFeedbackService } from "../../services/Feedback/CreateFeedbackService";

class CreateFeedbackController {
  async handle(req: Request, res: Response) {
    try {
      const { order_id, rating, comment } = req.body;

      const createFeedbackService = new CreateFeedbackService();
      const feedback = await createFeedbackService.execute({
        order_id,
        rating: Number(rating),
        comment,
      });

      res.json(feedback);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}

export { CreateFeedbackController };
