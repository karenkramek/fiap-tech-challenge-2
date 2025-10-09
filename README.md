# Tech Challenge - Fase 2 - Grupo 28 - 4FRNT

ByteBank: Arquitetura de Microfrontends com Webpack Module Federation + Cloud (AWS EC2 & Vercel).

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Webpack](https://img.shields.io/badge/Webpack-5-8DD6F9?style=flat&logo=webpack&logoColor=white)](https://webpack.js.org/)
[![Module Federation](https://img.shields.io/badge/Module_Federation-5-FF6B6B?style=flat&logo=webpack&logoColor=white)](https://webpack.js.org/concepts/module-federation/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Jest](https://img.shields.io/badge/Jest-29.7-C21325?style=flat&logo=jest&logoColor=white)](https://jestjs.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com/)
[![AWS EC2](https://img.shields.io/badge/AWS-EC2-FF9900?style=flat&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/ec2/)

## 🎯 Contexto da Fase 2

Esta é a evolução do [projeto da Fase 1](https://github.com/karenkramek/bytebank-fiap) para a Fase 2 do Tech Challenge (FIAP - Front-end Engineering). Nesta fase avançamos para uma **arquitetura de microfrontends**, compondo a aplicação a partir de múltiplos MFEs integrados via **Module Federation**, mantendo os princípios de componentização, reutilização e tipagem estática.

### 🚀 Principais Implementações da Fase 2:

- **Arquitetura de Microfrontends:** Webpack Module Federation para integração dinâmica entre Shell, Dashboard, Transactions e Shared Library
- **Gerenciamento de Estado:** Redux Toolkit com TypeScript para estado global compartilhado entre MFEs
- **Autenticação e Autorização:** Sistema de login/logout com proteção de rotas e controle de acesso
- **Deployment Híbrido Cloud:**
  - **Vercel (Frontends):** 4 projetos deployados com CDN global, HTTPS automático e deploy contínuo via GitHub
  - **AWS EC2 (Backend):** API Server e Upload Server containerizados com Docker em instância t3.micro (free tier)
- **CI/CD:** GitHub Actions para build e push automático de imagens Docker para Docker Hub
- **Testes Automatizados:** 57 testes com Jest e React Testing Library cobrindo componentes, hooks e integrações
- **Containerização:** Docker Compose para ambiente de desenvolvimento consistente e isolado

## 📋 Gestão de Projeto

- 📊 **Trello (Fase 2):** [Board de Acompanhamento de Atividades](https://trello.com/b/rP7VdDRt/fase-2)
- 🎨 **Figma (Fase 2):** [Protótipo e Design System](https://www.figma.com/design/tpk67fOWALc2rEf9r6bZjG/ByteBank-4FRNT---Fase2?node-id=1-750)
- 📹 **Vídeo de Apresentação (Fase 2):** TBD (em produção)
- 🔗 **Repositório Fase 1:** [bytebank-fiap](https://github.com/karenkramek/bytebank-fiap)

## 👥 Integrantes do Grupo

| Nome                                            | Email                                                         | RM                                          |
|-------------------------------------------------|---------------------------------------------------------------|---------------------------------------------|
| Fernanda Raquel Campos Jiacinto                 | [fernanda.frcj@gmail.com](mailto:fernanda.frcj@gmail.com)     | [366526](mailto:RM366526@fiap.com.br)       |
| Kaique Kenichi Furukawa Endo                    | [kaiquefurukawa@gmail.com](mailto:kaiquefurukawa@gmail.com)   | [366448](mailto:RM366448@fiap.com.br)       |
| Karen Cristina Kramek                           | [kakakramek@gmail.com](mailto:kakakramek@gmail.com)           | [361140](mailto:RM361140@fiap.com.br)       |
| Tatiane Gabrielle Marçal Rodrigues da Costa     | [tatiane.costa@alura.com.br](mailto:tatiane.costa@alura.com.br) | [365215](mailto:RM365215@fiap.com.br)     |

## 🌐 Deploy em Produção

A aplicação ByteBank está deployada em **arquitetura híbrida cloud**, combinando o melhor de cada plataforma:

### 🚀 Frontends (Vercel)
- **Shell App:** https://bytebank-shell.vercel.app
- **Dashboard MFE:** https://dashboard-mfe-eta.vercel.app
- **Transactions MFE:** https://transactions-mfe-iota.vercel.app
- **Shared Library:** https://bytebank-shared.vercel.app

### 🖥️ Backend (AWS EC2)
- **API Server:** http://44.206.72.128:3034
- **Upload Server:** http://44.206.72.128:3035

> ⚠️ **Nota de Segurança:** Este é um ambiente de demonstração para fins acadêmicos.
> A API é pública e contém apenas dados mock/exemplo. Não utilize para dados sensíveis reais.

📖 **Arquitetura de Deploy:** Ver [Deployment Híbrido Vercel + AWS](./docs/hybrid-deployment.md) para entender como funciona a estratégia de deploy em múltiplas clouds.

🔒 **Segurança e Boas Práticas:** Ver [Práticas de Segurança em Cloud](./docs/SECURITY_PRACTICES.md) para detalhes sobre autenticação, autorização, proteção de rotas, configurações de segurança AWS/Vercel e checklist de conformidade.

## 🧱 Visão da Arquitetura

- Shell App (porta 3030) — Host principal da aplicação
- Dashboard MFE (porta 3031) — Microfrontend de Dashboard
- Transactions MFE (porta 3032) — Microfrontend de Transações
- Shared Library (porta 3033) — Biblioteca compartilhada (componentes, hooks, utils)
- API Server (porta 3034) — Backend mock com JSON Server
- Upload Server (porta 3035) — Servidor para upload de arquivos

### Componentes e responsabilidades

| Camada                | Função principal                                                                 | Destaques técnicos |
|-----------------------|-----------------------------------------------------------------------------------|--------------------|
| `shell/`              | Orquestra layout, roteamento e consumo dos remotes via Module Federation.        | Webpack host expõe `dashboardMFE`, `transactionsMFE`, `shared`. |
| `dashboard-mfe/`      | Entrega o dashboard de saldo, gráficos e cartões informativos.                   | Exposto como `dashboardMFE/Dashboard`. |
| `transactions-mfe/`   | Lista, filtra e cria transações, delegando componentes de domínio à `shared`.    | Exposto como `transactionsMFE/TransactionsPage`. |
| `shared/`             | Biblioteca federada com componentes UI, hooks, serviços, DTOs e utilidades.      | Compartilhamento de estado/serviços entre MFEs. |
| `upload-server/`      | API Express dedicada a upload/remoção de anexos (persistidos em `uploads/`).     | Usa Multer, expõe `/api/upload` e `/uploads`. |
| `db.json` + JSON API  | Mock persistido do domínio (contas, transações) servido pelo `json-server`.       | Endpoint base `http://localhost:3034`. |

### Fluxo entre os módulos

1. `shared` publica remotes de componentes e serviços reutilizáveis (`shared@.../remoteEntry.js`).
2. `dashboard-mfe` e `transactions-mfe` consomem `shared` e expõem suas páginas como remotes próprios.
3. O `shell` carrega esses remotes dinamicamente e renderiza o conteúdo dentro do layout host.
4. Tanto os MFEs quanto o `shell` chamam o `json-server` para dados do domínio e o `upload-server` para anexos.
5. Os arquivos enviados ficam disponíveis via `/uploads`, servidos diretamente pelo servidor de upload.

Essa separação permite evoluir os MFEs e a lib compartilhada de forma independente, mantendo contratos via DTOs/serviços, e já antecipa uma implantação distribuída (por exemplo, buckets S3 + CloudFront para MFEs e ECS/Fargate para APIs) — tópico que podemos detalhar na próxima etapa.

## ✨ Funcionalidades

### 🏦 Dashboard e Visualização
- Dashboard intuitivo com saldo atual e controle de visibilidade
- Visualização de transações recentes (últimas 5)
- Cartões informativos com dados financeiros
- Gráficos e estatísticas de transações

### 💰 Gestão de Transações
- Listagem completa de transações com paginação
- **Filtro e pesquisa de transações** por descrição, valor, tipo e data
- **Scroll infinito** com carregamento progressivo (5 itens por vez)
- Adição de novas transações (depósito, saque, transferência, pagamento)
- Edição e exclusão de transações existentes
- **Sugestões inteligentes de descrições** durante o preenchimento
- **Validações completas** de formulário (valor, data, tipo, descrição)
- Upload de arquivos anexos às transações (PDF, imagens, documentos)
- Visualização e download de anexos

### 🔐 Autenticação e Segurança
- Sistema completo de login e registro de usuários
- **Proteção de rotas** com redirecionamento automático
- Persistência de sessão (localStorage)
- Logout com limpeza de dados sensíveis
- Validação de campos com feedback em tempo real

### 🎨 Interface e Experiência
- Design system consistente e responsivo (Tailwind CSS)
- **Página About/Sobre** com informações institucionais
- **Página Home** com hero image animada e apresentação
- **Notificações toast** para feedback de ações (sucesso, erro, loading)
- **Error Boundary** para captura e tratamento de erros
- Loading states e skeletons para melhor UX
- Sidebar responsiva com navegação intuitiva
- Header dinâmico com informações do usuário
- Footer com links e informações

### 🔧 Recursos Técnicos
- Tipagem estática completa com TypeScript
- Redux Toolkit para gerenciamento de estado global
- Custom hooks reutilizáveis (useTransactions, useAccount, useAuthProtection)
- Serviços tipados com validação (TransactionService, AccountService)
- Utilitários para formatação de moeda e datas
- Normalização de texto para busca sem acentos

## 🛠️ Tecnologias

- React
- TypeScript
- Webpack 5 Module Federation
- Tailwind CSS (no `dashboard-mfe` e nos componentes compartilhados conforme aplicável)
- JSON Server (API mock)
- Node.js/Express (servidor de upload)
- Multer (upload de arquivos)
- Docker & Docker Compose (ambiente containerizado para desenvolvimento)

## 📋 Banco de Dados

O projeto utiliza um sistema de banco de dados modelo que mantém dados de exemplo no repositório:

- **`db.template.json`** - Arquivo modelo versionado no Git
- **`db.json`** - Arquivo local criado automaticamente (ignorado pelo Git)

```bash
# O comando dev:all automaticamente cria db.json do template
npm run dev:all

# Para resetar dados locais:
rm db.json && npm run setup:db
```

📖 **Guia completo:** Ver [JSON Server Guide](./docs/json-server-guide.md)

## 🚀 Como Executar o Projeto

### Pré-requisitos

#### 🐳 Execução com Docker (Recomendado)

A forma mais simples e consistente de rodar o projeto é via Docker, garantindo que todos os serviços funcionem corretamente sem conflitos de ambiente.

- **Docker Engine** e **Docker Compose V2**
  - **macOS:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) ou [Colima](https://github.com/abiosoft/colima) (alternativa leve)
  - **Linux:** [Docker Engine](https://docs.docker.com/engine/install/) + [Docker Compose Plugin](https://docs.docker.com/compose/install/linux/)
  - **Windows:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) com backend WSL2
- **Portas 3030-3035** disponíveis no host
- **Git** para clonar o repositório

#### 💻 Execução local (alternativa)

Se preferir rodar sem Docker:

- **Node.js** versão 18 ou superior ([Download](https://nodejs.org/))
- **npm** (incluído com Node.js) ou **yarn**
- **Git** para clonar o repositório

---

## 🐳 Opção 1: Executar com Docker (Recomendado)

A estrutura Docker oferece hot reload, isolamento por serviço e ambiente consistente entre diferentes máquinas.

### Quick Start

```bash
# 1) Clone o repositório
git clone <url-do-repositorio>
cd fiap-tech-challenge-2

# 2) Suba todos os serviços
docker compose -f docker/docker-compose.dev.yml up
```

> 💡 Use `-d` para rodar em segundo plano: `docker compose -f docker/docker-compose.dev.yml up -d`

**Pronto!** Acesse a aplicação em [http://localhost:3030](http://localhost:3030)

### Recursos do ambiente Docker

- **Hot reload** — Alterações no código refletem automaticamente nos containers
- **Isolamento** — Cada serviço roda em seu próprio container
- **Volumes persistentes** — Dados do JSON Server e uploads são mantidos
- **Dependências gerenciadas** — Não há conflito com node_modules do host

### Próximos passos e documentação

Para operações avançadas, rebuild, troubleshooting e comandos específicos por sistema operacional, consulte:

- [Fluxos de Trabalho no Docker](./docs/docker-workflow.md) — Rebuild de imagens, checklist pós-`git pull`, comandos úteis e passo a passo por SO.
- [JSON Server Guide](./docs/json-server-guide.md) — Inspeção de volume, exportação e reset do `db.json`.

---

## 💻 Opção 2: Executar Localmente (Sem Docker)

### 📦 Instalação das Dependências

Como este é um projeto de microfrontends, **é necessário instalar as dependências de cada aplicação separadamente**:

**Opção 1 - Instalação automática (recomendada):**

```bash
# 1) Clone o repositório
git clone <url-do-repositorio>
cd fiap-tech-challenge-2

# 2) Execute o script que instala todas as dependências automaticamente
npm run install:all
```

**Opção 2 - Instalação manual:**

```bash
# 1) Clone o repositório
git clone <url-do-repositorio>
cd fiap-tech-challenge-2

# 2) Instale as dependências da raiz (para concurrently e json-server)
npm install

# 3) Instale as dependências de cada MFE e do Shell
cd shell && npm install && cd ..
cd dashboard-mfe && npm install && cd ..
cd transactions-mfe && npm install && cd ..
cd shared && npm install && cd ..
cd upload-server && npm install && cd ..
```

### 🏃‍♂️ Execução

Após instalar todas as dependências, execute na raiz do repositório:

```bash
# Inicie tudo de uma vez (API + Upload Server + Shared + Dashboard + Transactions + Shell)
npm run dev:all
```

**Método alternativo usando script bash:**

```bash
# Execute o script de conveniência
./start-all.sh
```

**Execução individual dos serviços:**

Também é possível iniciar cada serviço individualmente em terminais separados:

```bash
# API (JSON Server na porta 3034)
npm run dev:api

# Upload Server (porta 3035)
npm run dev:upload

# Biblioteca compartilhada (porta 3033)
npm run dev:shared

# Dashboard MFE (porta 3031)
npm run dev:dashboard

# Transactions MFE (porta 3032)
npm run dev:transactions

# Shell - aplicação principal (porta 3030)
npm run dev:shell
```

**⚠️ Importante:** Os MFEs devem estar rodando **antes** do Shell para que a integração via Module Federation funcione corretamente.

**🌐 Acesso:** Quando todos estiverem rodando, acesse: [http://localhost:3030](http://localhost:3030)

---

## 🧪 Testes

Este projeto conta com uma suíte completa de testes automatizados cobrindo todos os microfrontends e utilitários compartilhados.

### Cobertura de Testes

| Módulo | Arquivos de Teste | Total de Testes | Status |
|--------|-------------------|-----------------|---------|
| **Módulo Shared** | 2 | 25 testes | ✅ Todos passando |
| **Shell App** | 1 | 7 testes | ✅ Todos passando |
| **Dashboard MFE** | 1 | 11 testes | ✅ Todos passando |
| **Transactions MFE** | 1 | 14 testes | ✅ Todos passando |
| **TOTAL** | **5** | **57 testes** | **✅ 100% passando** |

### 🏃‍♂️ Executando os Testes

**Executar todos os testes (recomendado):**

```bash
# Executa os testes em todos os módulos
npm run test:all
```

**Executar testes por módulo específico:**

```bash
# Testes do módulo shared (utilitários e hooks)
cd shared && npm test

# Testes do Shell App (roteamento e layout)
cd shell && npm test

# Testes do Dashboard MFE (componentes de dashboard)
cd dashboard-mfe && npm test

# Testes do Transactions MFE (gestão de transações)
cd transactions-mfe && npm test
```

**Modo de desenvolvimento (watch mode):**

```bash
# Em qualquer módulo, para execução contínua durante desenvolvimento
npm run test:watch
```

**Relatórios de cobertura:**

```bash
# Gerar relatório de cobertura de testes
npm run test:coverage
```

### Stack de Testes

- **Jest 29.7.0** - Framework principal de testes
- **React Testing Library 14.1.2** - Utilitários para teste de componentes React
- **TypeScript** - Type safety completa nos testes
- **@testing-library/user-event** - Simulação avançada de interação do usuário

### Tipos de Testes Implementados

1. **Testes de Componentes** - Renderização, interação e comportamento dos componentes
2. **Testes de Hooks** - Lógica customizada de hooks React
3. **Testes de Utilitários** - Funções helper e formatadores
4. **Testes de Integração** - Fluxos completos de usuário e Module Federation
5. **Testes de Formulários** - Validação, submissão e estados de erro

📖 **Documentação completa:** Ver [Relatório de Implementação de Testes](./TESTING_IMPLEMENTATION_REPORT.md)

## 🔌 Portas

| Serviço            | Porta | URL                       |
|--------------------|-------|---------------------------|
| Shell App          | 3030  | [http://localhost:3030](http://localhost:3030) |
| Dashboard MFE      | 3031  | [http://localhost:3031](http://localhost:3031) |
| Transactions MFE   | 3032  | [http://localhost:3032](http://localhost:3032) |
| Shared Library     | 3033  | [http://localhost:3033](http://localhost:3033) |
| API Server (Mock)  | 3034  | [http://localhost:3034](http://localhost:3034) |
| Upload Server      | 3035  | [http://localhost:3035](http://localhost:3035) |

## 📜 Scripts Disponíveis

### Instalação e Setup

- `npm run install:all` — Instala dependências em todos os projetos (raiz, shell, MFEs e shared)
- `npm run setup:db` — Cria db.json a partir do template se não existir

### Desenvolvimento

- `npm run dev:all` — Inicia todos os serviços em paralelo
- `npm run dev:shell` — Inicia apenas o Shell
- `npm run dev:dashboard` — Inicia apenas o Dashboard MFE
- `npm run dev:transactions` — Inicia apenas o Transactions MFE
- `npm run dev:shared` — Inicia apenas a Shared Library
- `npm run dev:api` — Inicia apenas o JSON Server (API mock)
- `npm run dev:upload` — Inicia apenas o Upload Server

### Testes

- `npm test` — Executa todos os testes de todos os módulos
- `npm run test:shared` — Testes apenas do módulo shared
- `npm run test:shell` — Testes apenas do Shell App
- `npm run test:dashboard` — Testes apenas do Dashboard MFE
- `npm run test:transactions` — Testes apenas do Transactions MFE
- `npm run test:watch` — Modo watch para todos os módulos (desenvolvimento)
- `npm run test:coverage` — Gera relatórios de cobertura para todos os módulos

## 🧩 Escopo da Fase 2 (Resumo)

- Evolução para microfrontends com integração via Module Federation
- Separação de responsabilidades por MFE e biblioteca compartilhada
- Integração com API mock para fluxo de transações e dashboard
- Reutilização de componentes, hooks e utilitários entre MFEs

## 🛑 Encerrando a Execução

Para encerrar, use `Ctrl + C` no(s) terminal(is) em execução. Se estiver rodando tudo junto com `npm run dev:all`, interrompa no terminal desse comando.

## 🔧 Troubleshooting

**Problemas gerais:** Consulte o documento [Troubleshooting](./docs/troubleshooting.md) para um checklist rápido de erros comuns, comandos úteis e links para guias complementares.

**Problemas com testes:** Para questões específicas relacionadas à execução de testes, consulte [Troubleshooting de Testes](./docs/testing-troubleshooting.md).

## 🧹 Limpeza do Ambiente (Clean All)

Veja [Limpeza do Ambiente](./docs/environment-cleanup.md) para detalhes dos scripts disponíveis e orientações sobre quando utilizá-los.
