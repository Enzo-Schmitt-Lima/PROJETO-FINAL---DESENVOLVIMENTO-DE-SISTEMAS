import prismaClient from "../../../prisma";

interface ProdutoIngredienteRequest {
  produtoId: string;
  ingredienteId: string;
}

class CreateProdutoIngredienteService {
  async execute({ produtoId, ingredienteId }: ProdutoIngredienteRequest) {
    // 1️⃣ Verifica se a relação já existe
    const existente = await prismaClient.produtoIngrediente.findFirst({
      where: { produtoId, ingredienteId },
    });

    if (existente) {
      throw new Error("Esse ingrediente já está vinculado a esse produto");
    }

    // 2️⃣ Cria a relação conectando produto e ingrediente
    const relacao = await prismaClient.produtoIngrediente.create({
      data: {
        product: { connect: { id: produtoId } },
        ingredientes: { connect: { id: ingredienteId } },
      },
    });

    return relacao;
  }
}

export { CreateProdutoIngredienteService };
