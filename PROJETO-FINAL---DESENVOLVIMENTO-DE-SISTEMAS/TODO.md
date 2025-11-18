# TODO: Corrigir navegação após pagamento

## Tarefas Pendentes

- [x] Modificar app.routes.tsx: atualizar StackParamsList para Orders aceitar params order_id e number
- [x] Modificar Payment/index.tsx: após pagamento, navegar para Orders com params (order_id, number)
- [x] Modificar Orders/index.tsx: aceitar params order_id e number; alterar backButton para navegar para Order com esses params
- [x] Modificar Order/index.tsx: adicionar função para carregar estado do pedido (items) do backend e atualizar quantidades dos produtos
- [ ] Testar fluxo: finalizar pagamento -> Orders -> back -> Order com carrinho limpo
