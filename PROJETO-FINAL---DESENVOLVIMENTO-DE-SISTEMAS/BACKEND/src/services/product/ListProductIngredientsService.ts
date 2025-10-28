// src/services/product/ListProductIngredientsService.ts

import prismaClient from "../../../prisma";

interface ProductIngredientsRequest {
  product_id: string;
}

class ListProductIngredientsService {
  
  // Usamos o product_id (em inglês) que veio do controller
  async execute({ product_id }: ProductIngredientsRequest) {
    
    // 1. Buscamos as "ligações" (ProdutoIngrediente)
    const productIngredients = await prismaClient.produtoIngrediente.findMany({
      where: {
        produtoId: product_id, // Usamos o "produtoId" (camelCase) do seu banco
      },
      include: {
        // 2. Incluímos o Ingrediente relacionado
        // O seu TypeScript confirmou que o nome é "ingredientes" (plural)
        ingredientes: true, 
      },
    });

    // 3. Este é o pulo do gato:
    // Nós não queremos retornar o objeto de "ligação", nós queremos
    // retornar apenas a lista de ingredientes.
    
    // Mapeamos o array e retornamos apenas o objeto 'ingredientes' de dentro
    const onlyIngredients = productIngredients.map(item => item.ingredientes);

    // Isso vai retornar um array de ingredientes, ex: [ {id: "...", name: "..."}, ... ]
    // Se não achar nada, vai retornar [] (um array vazio)
    return onlyIngredients;
  }
}

export { ListProductIngredientsService };