import prismaClient from "../../../prisma";

class ListFeedbackService {
  async execute() {
    const feedbacks = await prismaClient.feedback.findMany({
      include: {
        order: true, 
      },
    });

    // calcula a média das notas
    const total = feedbacks.length;
    const avg =
      total > 0
        ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / total
        : 0;

    return {
      average_rating: Number(avg.toFixed(1)),
      total_feedbacks: total,
      feedbacks,
    };
  }
}

export { ListFeedbackService };
