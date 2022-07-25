<h1 id="top" align="center">🚀 Desafio técnico XP Inc. 2022 - Back-end 🚀</h1>

![](https://i.imgur.com/hDmClWE.png)

<h2>Tópicos:</h2>

- [Resumo do projeto](#summary)
- [Passo a passo](#stepByStep)
- [Explicando decisões do projeto](#decisions)
- [Explicando funcionalidades da API](#functionalities)
- [Próximos passos](#nextSteps)

---

<h2 id="summary">📝 Resumo do projeto</h2>

<br>

Essa é uma API RESTful que tem como objetivo simular o funcionamento de uma corretora e banco digital, foi desenvolvida com algumas funcionalidades simples de gerenciamento de clientes, contas, investimentos e ativos.

<p align="right"><a href="#top">Voltar ao topo</a></p>

---

<h2 id="stepByStep">🦶 Passo a passo</h2>

<br>

<details><summary>Como executar o projeto</summary>
<p>

<details><summary>🐋 Docker e docker-compose (recomendado)</summary>
<p>

<br>

⚠️ Pré requisitos: <a href="https://git-scm.com/book/en/v2/Getting-Started-Installing-Git">Git</a>, <a href="https://docs.docker.com/desktop/">Docker</a> e <a href="https://docs.docker.com/compose/install/">docker-compose</a>

<br>

```bash
# Faça o clone do repositório e entre na pasta do projeto:
$ git clone git@github.com:leonardoVogel/desafio-xpi-backend.git && cd desafio-xpi-backend

# Renomeie o arquivo .env.example para .env (não é necessário alterar as variáveis, apenas se deseja executar a aplicação em outra porta):
$ mv .env.example .env

# Suba os containers com o docker-compose:
$ docker-compose up -d

# Acesso o container para rodar a aplicação:
$ docker exec -it xpi_backend bash

# Instale as dependências:
$ yarn install

# Por fim, rode a aplicação (esse comando já irá gerar o banco de dados e popular com alguns dados, sempre que ele for executado o banco será restaurado):
$ yarn dev
```


```bash
# Após isso, você pode abrir um novo terminar e entrar novamente no container para executar o seguinte comando e iniciar um processo de atualização aleatória dos preços dos ativos:
$ yarn openmarket
```

</p>
</details>

<details><summary>Rodando local</summary>
<p>

</p>
</details>

</p>
</details>

<br>

<details><summary>Como interagir com o projeto</summary>
<p>

<details><summary>Utilizando VSCode + postman ou insomnia</summary>
<p>

<a href="/support/desafio-xpi-requests.json" download>Download Requests file</a>

- Importe o arquivo com as requests no postman ou insomnia;

- Configure as variáveis `base_url` (exemplo: `http://localhost:3000`) e `auth` com o token, depois que já tiver um.


</p>
</details>

<br>

<details><summary>Utilizando a documentação do swagger</summary>
<p>

- Acesse o deploy da API, no endpoint `/api-docs`: https://desafio-xpinc.herokuapp.com/api-docs/;

- Registre uma conta no endpoint `/register` e depois faça o login com esses mesmos dados no endpoint `/login`;

- Copie o token retornado na resposta do login e cole ele no campo `Value` ao clicar no botão `Authorize 🔓`;

- Após isso, todas as rotas estarão liberadas para interagir.

</p>
</details>


</p>
</details>

<p align="right"><a href="#top">Voltar ao topo</a></p>

---

<h2 id="decisions">👨‍💻 Explicando decisões do projeto</h2>

<br>

<details><summary>Ferramentas Utilizadas</summary>
<p>

- [Prisma](https://www.prisma.io)
  - Apesar de ter mais familiaridade com o sequelize, a própria documentação informa que existem lacunas no uso com o TypeScript ([fonte](https://sequelize.org/docs/v6/other-topics/typescript/)), então optei por utilizar o prisma, que ao contrário do sequelize é mais compatível com o TypeScript, tornando inclusive o processo de escrever o código mais rápido por conta do auto-complete do VSCode.

<br>

- [TypeScript](https://www.typescriptlang.org)
  - Decidi usar o TypeScript pois logo no inicio já imaginei que a aplicação teria várias integrações entre diferentes entidades do banco de dados e juntando isso com a escolha do prisma como ORM, eu poderia economizar muito tempo com bugs e erros que só seriam descobertos mais tarde. Com o TypeScript, eu consigo fazer o código ficar mais legível, organizado e com menos bugs.

<br>

- [joi](https://joi.dev)
  - A escolha do joi se deu principalmente por já ter usado em diversos projetos na Trybe, já estava familiarizado e sabia que iria me atender bem.
  - Além disso, torna o processo muito mais rápido, já tendo ferramentas prontas para validações padrão como email por exemplo.

<br>

- [jsonwebtoken](https://jwt.io)
  - Assim como o joi, a escolha do jsonwebtoken se deu por já ter usado em diversos projetos na Trybe, além de ser muito usada pela comunidade pela sua facilidade e confiabilidade.

<br>

- [bcrypt](https://www.npmjs.com/package/bcrypt)
  - Decidi usar o bcrypt pois precisava armazenar a senha dos clientes de uma forma segura no banco de dados, por se tratar de uma informação sensível.

<br>

- [jest](https://jestjs.io/pt-BR/)
  - Escolhi o jest por achar uma ferramenta bem completa para meus objetivos e também já ter usado em outros projetos

<br>

- [eslint](https://eslint.org)
  - Achei necessário o uso do eslint para manter um padrão e organização no projeto, acabei editando varias regras por já estar adaptado a um padrão proximo ao dos projetos da trybe.

</p>
</details>

<br>

<details><summary>Decisões durante o desenvolvimento do projeto</summary>
<p>

No inicio do projeto, passei bastante tempo planejando o que eu queria fazer e tentando deixar bem nítido na minha cabeça o passo a passo que deveria seguir, mas acabei me prendendo muito a modelagem do banco de dados. Passei por várias modelagens diferentes (algumas pode ser encontradas na pasta support) e sempre que eu terminava a modelagem para começar a escrever o código, me deparava com algum empecilho que me impediria de continuar daquela maneira.

Durante o desenvolvimento, optei por criar uma branch separada e fazer tudo através de pull requests documentados, adicionando ci (continuous integration) que só me deixava fazer o merge com todos os testes passando. Essa decisão me salvou em várias vezes onde dei push no código sem perceber que havia quebrado alguns testes.

Organizei os pull requests em features principais, e após acabar as implementações já fazia os testes unitários referentes aquela lógica, tentando manter sempre uma média acima de 80% de cobertura.

Tive apenas uma dificuldade com os testes unitários, que foi testar uma preview feature do prisma, não encontrei solução para isso e inclusive abri uma discussão no github ([aqui](https://github.com/prisma/prisma/discussions/14435)) para tentar resolver o problema, mas não tive resposta até agora.

Algo interessante que me orgulho de ter feito, foi criar um script responsável por atualizar randomicamente o preço das ações do banco de dados a cada 5 segundos por padrão. Fiz isso pois construi boa parte da lógica de negócio durante o final de semana e pela madrugada, quando o mercado não estava aberto e com isso, não conseguiria ver o funcionamento da lógica. Com esse script eu pude simular a variação de preço de um ativo enquanto o mercado está aberto, em qualquer horário e qualquer dia.

</p>
</details>

<br>

<p align="right"><a href="#top">Voltar ao topo</a></p>

---

<h2 id="functionalities">⚙️ Funcionalidades da aplicação</h2>

<br>

<h3>Clients:</h3>

| Endpoint | Descrição |
|---|---|
| /register | Registra um cliente no banco de dados |
| /login | Usado para logar um usuário, retorna um token |

<br>

<h3>Investments:</h3>

| Endpoint | Descrição |
|---|---|
| /investments/buy | Registra a compra de um ativo, diminuindo o saldo disponível |
| /investments/sell | Registra a venda de um ativo, aumentando o saldo disponível |

<br>

<h3>Account:</h3>

| Endpoint | Descrição |
|---|---|
| /account/deposit | Realiza um depósito na conta |
| /account/withdrawal | Realiza um saque da conta |
| /account/balance | Retorna o saldo disponível e investido da conta |
| /account/assets | Retorna uma lista com as ações no portfolio do cliente |
| /account/transactions-statement | Retorna um extrato das transações efetuadas pela conta, recebe page e type no query param |
| /account/investments-statement | Retorna um extrato dos investimentos efetuados pela conta, recebe page e type no query param |

<br>

<h3>Assets:</h3>

| Endpoint | Descrição |
|---|---|
| /assets/:id | Retorna as informações sobre um ativo |
| /assets | Retorna uma lista com todos os ativos |

<p align="right"><a href="#top">Voltar ao topo</a></p>

---

<h2 id="nextSteps">Próximos passos</h2>

<br>

- [ ] Transportar a lógica para uma aplicação em Nest.js;
- [ ] Criar testes de integração e E2E;
- [ ] Adicionar tabela intermediária, guardando as ordens de compra e venda;
- [ ] Adicionar lógica para calcular corretamente o preço médio;
- [ ] Adicionar lógica para calcular a variação patrimonial e de um ativo, dado um período;
- [ ] .....

<br>

<p align="right"><a href="#top">Voltar ao topo</a></p>

---


Projeto desenvolvido por [Leonardo Vogel](https://www.linkedin.com/in/leonardovogel/)