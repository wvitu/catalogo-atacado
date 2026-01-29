# Catálogo de Atacado – Projeto Real (Full Stack)

Aplicação web **full stack** desenvolvida para atender uma demanda real da empresa onde trabalho atualmente: centralizar o cadastro de produtos, organizar por categorias e gerar um **catálogo de atacado pronto para impressão ou PDF**, facilitando vendas presenciais e envio para lojistas.

O projeto foi pensado desde o início para ser **escalável**, permitindo no futuro a criação de catálogos para diferentes empresas.

---

## 🎯 Objetivo do projeto

* Reduzir retrabalho na criação de catálogos
* Centralizar cadastro e atualização de produtos
* Garantir controle sobre produtos ativos e inativos
* Gerar catálogo profissional para impressão (PDF)
* Aplicar boas práticas de desenvolvimento web full stack

---

## ✨ Funcionalidades principais

### 📦 Produtos

* Cadastro de produtos com:

  * Nome
  * Código / referência
  * Preço de atacado
  * Categoria
  * Imagem (upload opcional)
* Listagem de produtos no catálogo **somente quando ativos**
* Área administrativa para:

  * Editar produto
  * Ocultar / reativar produto (soft delete)
  * Excluir produto
  * Atualizar imagem do produto

### 🧾 Catálogo para impressão / PDF

* Página dedicada para geração de catálogo
* Utiliza o recurso nativo do navegador (**Ctrl + P → Salvar como PDF**)
* Catálogo gerado apenas com **produtos ativos**
* Organização por categorias
* Estrutura pensada para impressão em formato **A4**

### 🏢 Configurações do catálogo / empresa

* Cadastro de informações da empresa:

  * Nome da empresa
  * Nome do catálogo
  * Telefone para contato
* Essas informações são utilizadas no catálogo e no PDF
* Base para transformar o sistema em uma solução reutilizável para diferentes negócios

---

## 🧠 Por que esse projeto é relevante?

Este projeto não é apenas um exercício acadêmico. Ele foi desenvolvido para **resolver um problema real do dia a dia da empresa**, aplicando conceitos fundamentais exigidos em vagas **junior**:

* CRUD completo (Create, Read, Update, Delete)
* Validação de dados no backend
* Separação de responsabilidades
* Integração frontend ↔ backend
* Upload de arquivos (imagens)
* Organização de código
* Versionamento com Git e GitHub
* Pensamento de produto e escalabilidade

---

## 🛠️ Tecnologias utilizadas

### Front-end

* React
* TypeScript
* Vite
* React Router
* Consumo de API REST
* Gerenciamento de estado com hooks

### Back-end

* Node.js
* Express
* Organização por rotas (products, admin, settings)
* Validações de dados
* Upload de arquivos com **multer**

### Banco de dados e Storage

* Supabase

  * Banco de dados relacional
  * Storage para imagens dos produtos
  * Endpoints para configurações do catálogo

---

## ✅ Regras e validações implementadas

* **Nome do produto**

  * Obrigatório
  * Mínimo de caracteres
* **Código do produto**

  * Obrigatório
  * Sanitização de dados
* **Preço**

  * Conversão para número
  * Validação (valor maior que zero)
* **Categoria**

  * Controlada (somente categorias permitidas)
* **Upload de imagem**

  * Tipos permitidos: JPEG, PNG, WEBP
  * Limite de tamanho
  * Substituição da imagem anterior (upsert)

---

## 📌 Principais endpoints da API

* GET /health – Healthcheck da API
* GET /products – Lista produtos ativos (catálogo público)
* GET /admin/products – Lista todos os produtos (admin)
* POST /products – Cadastrar produto
* PATCH /products/:id – Editar produto
* PATCH /products/:id/ativo – Ocultar / reativar produto
* DELETE /products/:id – Excluir produto
* POST /products/:id/image – Upload de imagem
* GET /settings – Buscar configurações do catálogo
* PATCH /settings – Atualizar configurações do catálogo

---

## 🌱 Variáveis de ambiente

O projeto utiliza variáveis de ambiente para integração com o Supabase.

Exemplo de variáveis necessárias:

SUPABASE_URL=[https://seu-projeto.supabase.co](https://seu-projeto.supabase.co)
SUPABASE_SERVICE_ROLE_KEY=sua_chave_aqui
PORT=3333

---

## 🚀 Como rodar o projeto localmente

### Pré-requisitos

* Node.js instalado
* Conta no Supabase com:

  * Tabela de produtos
  * Bucket para imagens

### Clonar o repositório

git clone [https://github.com/wvitu/catalogo-atacado.git](https://github.com/wvitu/catalogo-atacado.git)
cd catalogo-atacado
npm install

### Rodar a API

cd apps/api
npm install
npm run dev

A API irá rodar em:
[http://localhost:3333](http://localhost:3333)

### Rodar o Front-end

cd apps/web
npm install
npm run dev

A aplicação web estará disponível em:
[http://localhost:5173](http://localhost:5173)

---

## 🧩 Próximos passos (Roadmap)

* Melhorar layout e identidade visual
* Ajustar layout do PDF:

  * Padronizar tamanho dos cards
  * Evitar quebra de produtos entre páginas
  * Melhorar destaque das categorias
* Criar autenticação para área administrativa
* Permitir múltiplos catálogos por empresa (multi-tenant)
* Deploy da aplicação (Vercel / Render)
* Tornar a aplicação um produto reutilizável para outros negócios

---

## 👨‍💻 Sobre mim

Sou estudante de **Análise e Desenvolvimento de Sistemas** e estou em **transição de carreira para a área de TI**.
Este projeto foi desenvolvido para atender uma necessidade real do meu trabalho atual, aplicando na prática conceitos essenciais para desenvolvimento web e reforçando minha preparação para vagas **junior**.

GitHub: [https://github.com/wvitu](https://github.com/wvitu)
LinkedIn: [https://www.linkedin.com/in/wvitor/](https://www.linkedin.com/in/wvitor/)
