# Desafio técnico XP Inc.

## TO-DO List
- [X] POST /investments/buy
- [X] POST /investments/sell
- [X] POST /account/deposit
- [X] POST /account/withdraw
- [X] GET /account/:id/balance (criado sem o param id, usando o id vindo do token)
- [X] GET by client /account/:id/assets (criado sem o param id, usando o id vindo do token)
- [X] GET by assets /assets/:id

- [ ] GET all assets /assets
- [ ] GET assets /assets/symbol (query params: symbol)
- [ ] GET account info /account/:id

---
### Requisitos obrigatórios:
- [ ] Readme com explicação sobre abordagens e decisões tomadas
- [ ] Readme com instrução de como executar a aplicação
- [ ] Todos os endpoints obrigatórios feitos

### Requisitos bonus:
- [X] Testes unitários (pelo menos 75% de cobertura)
- [ ] Deploy da api
- [X] Autenticação e autorização com JWT
- [ ] Documentação com Swagger

### Checklist bonus do bonus:
- [ ] Continuous Deploy com Heroku
- [ ] Testes de integração e E2E
- [ ] Lógica para separar compra e venda de ativos em lotes padrão ou mercado fracionário
- [ ] Script para alterar o preço do ativo a cada 10s
- [ ] Lógica para calcular preço médio
- [ ] Lógica para atualizar o valor investido de acordo com a cotação atual.
- [ ] Variação do ativo no portfolio

