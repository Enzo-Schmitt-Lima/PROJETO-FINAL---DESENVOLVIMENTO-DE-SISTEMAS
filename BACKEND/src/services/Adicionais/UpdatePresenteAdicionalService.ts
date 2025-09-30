import { error } from "console";
import prismaClient from "../../../prisma";

interface UpdatePresenteRequest {
  adicionalId: string;
  presente: boolean;
  adicionando: boolean;
}

class UpdatePresenteAdicionalService {
  async execute({ adicionalId, presente, adicionando }: UpdatePresenteRequest) {
    // Verifica se o adicional existe
    const adicional = await prismaClient.adicionais.findUnique({
      where: { id: adicionalId },
    });

    if (!adicional) {
      throw new Error("Adicional não encontrado");
    }

    if (presente === false && adicionando === true) {
      throw new Error("Não é possível adicionar este ingrediente se o usuário escolheu removê-lo")
    }

    // Atualiza o status "presente"
    const atualizado = await prismaClient.adicionais.update({
      where: { id: adicionalId },
      data: { presente, adicionando },
    });

    

    return atualizado;
  }
}

export { UpdatePresenteAdicionalService };
