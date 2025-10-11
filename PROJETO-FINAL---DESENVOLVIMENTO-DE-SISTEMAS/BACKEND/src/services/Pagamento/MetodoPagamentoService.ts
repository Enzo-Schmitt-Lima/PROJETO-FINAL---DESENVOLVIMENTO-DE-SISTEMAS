// src/services/Pagamento/MetodoPagamentoService.ts
import prismaClient from "../../../prisma";
import { MetodoPagamento } from "../../controllers/Pagamento/MetodoPagamentoController";

interface MetodoPagamentoRequest {
  id: string;
  metodo: MetodoPagamento;
}

class MetodoPagamentoService {
  async execute({ id, metodo }: MetodoPagamentoRequest) {
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
