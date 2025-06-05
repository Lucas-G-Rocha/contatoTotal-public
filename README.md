# 🥋 Contato Total

Aplicação web para gerenciamento de alunos, aulas e pagamentos em academias — idealizada e desenvolvida por **Lucas Gomes Da Rocha**.

---

## 🔗 Acesso ao Projeto

Acesse a versão pública e de testes do projeto através do link:

👉 [https://contatototal-public.onrender.com](https://contatototal-public.onrender.com)

### 🧪 Conta para Testes

- **Usuário (admin):** `publicAdminTester`
- **Senha:** `01022003`

> ⚠️ **Observação Importante**  
> Este projeto está hospedado em um servidor **gratuito da Render**, que entra em **hibernação** quando não está em uso. Isso significa que ao acessar o link pela primeira vez, o servidor pode levar **cerca de 1 minuto** para "acordar" e exibir o site.  
>  
> Além disso, este é um ambiente de testes e **não contém dados reais de usuários**, exceto caso algum visitante, por conta própria, cadastre informações reais — **o objetivo aqui é apenas demonstrar a aplicação**. Esta **não é a versão final nem oficial** da plataforma.

---

## 🧠 Sobre o Projeto

A **Contato Total** é uma academia de artes marciais administrada por um familiar. Diante das dificuldades enfrentadas para gerenciar alunos, informações, pagamentos e matrículas, resolvi criar uma aplicação para ajudar nesse processo.

Com os conhecimentos que possuía na época (meados de 2024) em **Node.js, JavaScript, MongoDB e Handlebars**, desenvolvi esta aplicação como uma solução prática para as necessidades do dia a dia da academia.

---

## 🛠️ Tecnologias e Dependências Utilizadas

- [Node.js](https://nodejs.org/)
- [MongoDB + Mongoose](https://mongoosejs.com/)
- [Express.js](https://expressjs.com/)
- [Handlebars (hbs)](https://handlebarsjs.com/)
- [JWT (jsonwebtoken)](https://github.com/auth0/node-jsonwebtoken)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [dotenv](https://github.com/motdotla/dotenv)
- [express-validator](https://express-validator.github.io/)

---

## ✅ Funcionalidades

- [x] Login e autenticação com JWT
- [x] Cadastro e listagem de alunos
- [x] Filtro de alunos por nome
- [x] Cadastro de aulas
- [x] Cadastro e exibição de pagamentos
- [x] Filtragem de dados por usuário
- [x] Tratamento de erros com mensagens claras
- [x] Trancar, ativar e desativar matrículas
- [x] Edição de dados dos alunos (exceto usuário e senha pelo admin)
- [x] Validação de dados
- [ ] Prevenção de cadastros duplicados (em desenvolvimento)
- [ ] Exibição de Aulas (em desenvolvimento)
- [ ] Página de Financeiro (em desenvolvimento)
- [ ] Indexação para facilitar o gerenciamento

---

## 🔐 Variáveis de Ambiente

O projeto utiliza variáveis de ambiente para funcionar LOCALMENTE corretamente. No `.env` você precisa definir:

```env
MONGO_URI=<URL do seu MongoDB>
TOKEN_JWT=<Token para geração de JWTs>
SECRET_KEY=<Uma string segura para validação dos tokens>
PORT=3000 # (opcional)
```

## 🧪 Testando com Usuário Comum

Usuários comuns (não-admins) têm seus logins **gerados dinamicamente** no momento do cadastro, e **não são exibidos em nenhuma listagem ainda**.

- A **senha padrão** é a **data de nascimento do aluno**, **sem as barras** (ex: `01022003`).
- A interface do usuário comum ainda está **incompleta e pouco estilizada**, pois o foco atual do projeto está voltado para o **painel administrativo**.

---

## 🚧 Status do Projeto

O projeto ainda está em desenvolvimento e possui alguns **bugs e limitações conhecidas**, como:

- ❌ Cadastro duplicado de usuários ainda não está bloqueado
- ⏳ Algumas páginas (como **Aulas** e **Financeiro**) ainda não foram finalizadas
- 🧭 Falta de um sistema de **indexação** mais eficiente no painel administrativo
- 🎨 Necessita de **melhorias visuais e de usabilidade**, especialmente para o lado do **usuário comum**

---

## 🎯 Planejamentos Futuros

Planos para a evolução do projeto incluem:

- 💳 Implementar **pagamentos online** com gateways como Stripe ou MercadoPago
- 🔐 Sistema de **login real para alunos**
- 📱 Criação de um **aplicativo móvel** integrado à aplicação web
- 📅 Página de **eventos e avisos**
- 🛒 **Loja virtual** integrada ao sistema
- 📊 Dashboard administrativo com:
  - Fluxo de entrada e saída de alunos
  - Fluxo de caixa
  - Gerenciamento financeiro completo
  - Relatórios e estatísticas detalhados

---

## 👨‍💻 Autor

Desenvolvido por **Lucas Gomes Da Rocha**.
Fique a vontade para entrar em contato
📞 **Contato:** (81) 98520-4507  

