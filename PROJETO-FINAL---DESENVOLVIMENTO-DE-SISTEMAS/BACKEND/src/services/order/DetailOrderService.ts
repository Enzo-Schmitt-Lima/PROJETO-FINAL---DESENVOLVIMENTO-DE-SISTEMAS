import prismaClient from "../../../prisma";

interface DetailRequest {
    order_id: string;
}

class DetailOrderService {
  async execute({ order_id }: DetailRequest) {
    try {
      const order = await prismaClient.order.findUnique({
        where: { id: order_id },
        include: {
          items: {
            include: {
              product: {
                include: {
                  productIngrediente: {
                    include: {
                      ingrediente: true,
                    },
                  },
                },
              },
              ItemIngrediente: {
                include: {
                  ingrediente: true,
                },
              },
              ItemAdicional: {
                include: {
                  adicionais: true,
                },
              },
            },
          },
          pagamento: true,
          table: true,
        },
      });

      if (!order) {
        return { error: 'Pedido não encontrado' };
      }

      // Enrich items with a merged list of ingredients and adicionais
      const itemsWithDetails = order.items.map(item => {
        // Map base ingredients from the product
        const baseIngredients = item.product.productIngrediente.map(pi => ({
          id: pi.ingrediente.id,
          name: pi.ingrediente.name,
          removed: false,
        }));

        // Create a map for efficient lookup
        const ingredientsMap = new Map(baseIngredients.map(ing => [ing.id, ing]));

        // Override with specific item customizations (removed ingredients)
        item.ItemIngrediente.forEach(customIngredient => {
          if (ingredientsMap.has(customIngredient.ingredienteId)) {
            ingredientsMap.get(customIngredient.ingredienteId)!.removed = customIngredient.removed;
          }
        });

        // Map selected adicionais for the item
        const adicionais = item.ItemAdicional.map(ia => ({
          id: ia.adicionalId,
          name: ia.adicionais.name,
          price: ia.adicionais.price,
          quantity: ia.quantity,
          itemAdicionalId: ia.id, // Pass the ID of the join table entry
        }));

        return {
          ...item,
          ingredients: Array.from(ingredientsMap.values()),
          adicionais: adicionais,
        };
      });
      
      const orderWithEnrichedItems = { ...order, items: itemsWithDetails };

      console.log('DetailOrderService - fetched order id:', order_id, 'items count:', order.items.length || 0);

      const statusTextMap: any = { 0: 'Em preparo', 1: 'Em preparo', 2: 'Pronto', 3: 'Finalizado' };
      const MapMetodo: any = { 0: 'Pix', 1: 'Débito', 2: 'Crédito', 3: 'Dinheiro físico (pagar com o garçom)' };

      const orderWithText = {
        ...orderWithEnrichedItems,
        statusText: typeof order.status === 'number' ? statusTextMap[order.status] : undefined,
        pagamento: (order.pagamento || []).map((p: any) => ({
          ...p,
          statusText: p.statusText || (p.metodo !== undefined ? MapMetodo[p.metodo] : undefined),
        })),
      };

      return orderWithText;
    } catch (err: any) {
      console.error('DetailOrderService - error while fetching order detail:', err?.stack ?? err);
      return { error: 'Erro ao buscar detalhe do pedido', details: err?.message || String(err) };
    }
  }
}

export { DetailOrderService }