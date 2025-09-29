import prismaClient from "../../../prisma";

interface CreateAdicionalRequest {
  produtoIngredienteId: string;
}

class CreateAdicionalService {
  async execute({ produtoIngredienteId }: CreateAdicionalRequest) {
    // 1️⃣ Verifica se já existe na tabela de adicionais
    const existente = await prismaClient.adicionais.findFirst({
      where: { produtoIngredienteId },
    });

    if (existente) {
      throw new Error("Esse produtoIngrediente já está como adicional");
    }

    // 2️⃣ Cria o adicional
    const adicional = await prismaClient.adicionais.create({
      data: {
        produtoIngrediente: { connect: { id: produtoIngredienteId } },
        presente: false, // já define como false
      },
    });

    // 3️⃣ Atualiza o ProdutoIngrediente se necessário
    await prismaClient.produtoIngrediente.update({
      where: { id: produtoIngredienteId },
      data: {
        // opcional: você pode atualizar algum campo se quiser marcar que virou adicional
      },
    });

    return adicional;
  }
}

export { CreateAdicionalService };
