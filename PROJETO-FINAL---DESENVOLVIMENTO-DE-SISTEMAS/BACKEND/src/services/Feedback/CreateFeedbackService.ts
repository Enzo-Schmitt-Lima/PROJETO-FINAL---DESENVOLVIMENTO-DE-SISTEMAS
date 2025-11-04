import prismaClient from "../../../prisma";

interface CreateFeedbackRequest {
  order_id: string;
  rating: number;
  comment?: string;
}

class CreateFeedbackService {
  async execute({ order_id, rating, comment }: CreateFeedbackRequest) {
    if (rating < 1 || rating > 5) {
      throw new Error("A avaliação deve ser entre 1 e 5 estrelas");
    }

    // Verifica se o pedido existe
    const orderExists = await prismaClient.order.findUnique({
      where: { id: order_id },
    });

    if (!orderExists) {
      throw new Error("Pedido não encontrado");
    }

    const feedback = await prismaClient.feedback.create({
      data: {
        order_id,
        rating,
        comment,
      },
    });

    return feedback;
  }
}

export { CreateFeedbackService };
