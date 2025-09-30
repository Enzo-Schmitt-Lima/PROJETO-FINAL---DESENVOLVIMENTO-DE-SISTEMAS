import prismaClient from "../../../prisma";

interface CreateAdicionalRequest {
  produtoIngredienteId: string;
}

class CreateAdicionalService {
  async execute({ produtoIngredienteId }: CreateAdicionalRequest) {
    const existente = await prismaClient.adicionais.findFirst({
      where: { produtoIngredienteId },
    });

    if (existente) {
      throw new Error("Esse produtoIngrediente já está como adicional");
    }


    const adicional = await prismaClient.adicionais.create({
      data: {
        produtoIngrediente: { connect: { id: produtoIngredienteId } },
        presente: false, 
      },
    });

 
    await prismaClient.produtoIngrediente.update({
      where: { id: produtoIngredienteId },
      data: {
        
      },
    });

    return adicional;
  }
}

export { CreateAdicionalService };
