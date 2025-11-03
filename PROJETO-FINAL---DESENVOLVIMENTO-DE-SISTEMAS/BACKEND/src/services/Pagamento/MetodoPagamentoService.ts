// src/services/Pagamento/MetodoPagamentoService.ts
import prismaClient from "../../../prisma";
import { MetodoPagamento } from "../../controllers/Pagamento/MetodoPagamentoController";

interface MetodoPagamentoRequest {
  id: string;
  metodo: MetodoPagamento;
}

class MetodoPagamentoService {
  async execute({ id, metodo }: MetodoPagamentoRequest) {
    // Buscar o pagamento atual para verificar se metodo já está definido
    const existingPagamento = await prismaClient.pagamento.findUnique({
      where: { id },
    });

    if (!existingPagamento) {
      throw new Error("Pagamento não encontrado");
    }

    // Se metodo já está definido (não é 0), não sobrescrever
    if (existingPagamento.metodo !== 0) {
      const MapMetodo = {
        [MetodoPagamento.CREDITO]: "Crédito",
        [MetodoPagamento.DEBITO]: "Débito",
        [MetodoPagamento.PIX]: "Pix",
        [MetodoPagamento.DINHEIRO_FÍSICO]: "Dinheiro físico (pagar com o garçom)"
      };

      return {
        ...existingPagamento,
        statusText: MapMetodo[existingPagamento.metodo as MetodoPagamento]
      };
    }

    // Caso contrário, atualizar normalmente
    const pagamento = await prismaClient.pagamento.update({
      where: { id },
      data: { metodo },
    });

    const MapMetodo = {
        [MetodoPagamento.CREDITO]: "Crédito",
        [MetodoPagamento.DEBITO]: "Débito",
        [MetodoPagamento.PIX]: "Pix",
        [MetodoPagamento.DINHEIRO_FÍSICO]: "Dinheiro físico (pagar com o garçom)"
    };

    return {
        ...pagamento,
        statusText: MapMetodo[metodo]
    };
  }
}

export { MetodoPagamentoService };
