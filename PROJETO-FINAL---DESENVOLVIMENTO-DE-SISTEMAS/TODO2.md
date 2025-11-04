# TODO: Implementar edição de ingredientes por item no carrinho

## Tarefas Pendentes

- [ ] Criar modelo/tabela itemIngrediente no Prisma (similar a itemAdicional)
- [ ] Criar serviços/controllers para adicionar/remover ingredientes por item
- [ ] Modificar EditProductIngredients: aceitar item_id, carregar ingredientes do produto, permitir toggle de remoção (não salva no banco)
- [ ] Modificar Cart: passar item_id em vez de product_id para EditProductIngredients
- [ ] Atualizar rotas e tipos no frontend
- [ ] Testar edição de ingredientes no carrinho
