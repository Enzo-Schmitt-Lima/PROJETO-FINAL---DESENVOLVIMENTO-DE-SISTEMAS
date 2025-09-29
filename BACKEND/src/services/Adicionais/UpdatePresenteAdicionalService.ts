import prismaClient from "../../../prisma";

interface UpdatePresenteRequest {
  adicionalId: string;
  presente: boolean;
}

class UpdatePresenteAdicionalService {
  async execute({ adicionalId, presente }: UpdatePresenteRequest) {
    // Verifica se o adicional existe
    const adicional = await prismaClient.adicionais.findUnique({
      where: { id: adicionalId },
    });

    if (!adicional) {
      throw new Error("Adicional não encontrado");
    }

    // Atualiza o status "presente"
    const atualizado = await prismaClient.adicionais.update({
      where: { id: adicionalId },
      data: { presente },
    });

    return atualizado;
  }
}

export { UpdatePresenteAdicionalService };
