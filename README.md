# Tech Challenge - Fase 2 - Grupo 28 - 4FRNT

ByteBank - Arquitetura de Microfrontends com Webpack Module Federation.

## 🎯 Contexto da Fase 2

Esta é a evolução do projeto da Fase 1 para a Fase 2 do Tech Challenge (FIAP - Front-end Engineering). Nesta fase avançamos para uma arquitetura de microfrontends, compondo a aplicação a partir de múltiplos MFEs integrados via Module Federation, mantendo os princípios de componentização, reutilização, tipagem estática e centralização de regras de negócio.

## 🎥 Demo e Design

- 📹 Vídeo de Apresentação (Fase 1 – conceito e UI): [Assista no Loom](https://www.loom.com/share/35534aa22a264f7da957a72e228920e7?sid=1991a61a-66c3-4387-a536-83a96cf53144)
- 🎨 Design no Figma: [Protótipo no Figma](https://www.figma.com/design/Y2JoXXiG50h2nj9FiG71i7/ByteBank-4FRNT---Fase1?node-id=0-1&p=f&t=vmoSPz2lFa4bemW4-0)

## 🧱 Visão da Arquitetura

- Shell App (porta 3030) — Host principal da aplicação
- Dashboard MFE (porta 3031) — Microfrontend de Dashboard
- Transactions MFE (porta 3032) — Microfrontend de Transações
- Investments MFE (porta 3036) — Microfrontend de Investimentos e Metas
- Shared Library (porta 3033) — Biblioteca compartilhada (componentes, hooks, utils)
- API Server (porta 3034) — Backend mock com JSON Server
- Upload Server (porta 3035) — Servidor para upload de arquivos

### Componentes e responsabilidades

| Camada               | Função principal                                                                                  | Destaques técnicos |
|----------------------|---------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------|
| `shell/`             | Orquestra layout, roteamento e consumo dos remotes via Module Federation.                         | Webpack host expõe `dashboardMFE`, `transactionsMFE`, `investmentsMFE`, `shared`. |
| `dashboard-mfe/`     | Saldo, listagem, gestão de transações, delegando componentes de domínio à `shared`.               | Exposto como `dashboardMFE/Dashboard`.                                            |
| `transactions-mfe/`  | Listagem, filtro e gestão de transações, delegando componentes de domínio à `shared`.             | Exposto como `transactionsMFE/TransactionsPage`.                                  |
| `investments-mfe/`   | Gráficos, gestão de investimentos, metas, resgates e análise de performance.                      | Exposto como `investmentsMFE/InvestmentsPage`.                                    |
| `shared/`            | Biblioteca federada com componentes UI, hooks, serviços, DTOs e utilidades.                       | Compartilhamento de estado/serviços entre MFEs.                                   |
| `upload-server/`     | API Express dedicada a upload/remoção de anexos (persistidos em `uploads/`).                      | Usa Multer, expõe `/api/upload` e `/uploads`.                                     |
| `db.json` + JSON API | Mock persistido do domínio (contas, transações, investimentos, metas) servido pelo `json-server`. | Endpoint base `http://localhost:3034`.                                            |

### Fluxo entre os módulos

1. `shared` publica remotes de componentes e serviços reutilizáveis (`shared@.../remoteEntry.js`).
2. Os MFEs (`dashboard-mfe`, `transactions-mfe`, `investments-mfe`) consomem `shared` e expõem suas páginas como remotes próprios.
3. O `shell` carrega esses remotes dinamicamente e renderiza o conteúdo dentro do layout host.
4. Todos os MFEs e o `shell` consomem o `json-server` para dados do domínio e o `upload-server` para anexos.
5. Os arquivos enviados ficam disponíveis via `/uploads`, servidos diretamente pelo servidor de upload.

Essa separação permite evoluir MFEs e a lib compartilhada de forma independente, mantendo contratos via DTOs/serviços, e já antecipa uma implantação distribuída (ex: buckets S3 + CloudFront para MFEs e ECS/Fargate para APIs).

## ✨ Funcionalidades

- Dashboard intuitivo com saldo, listagem e gestão de transações
- Gestão completa de Transações (listar, filtrar, criar, editar e remover)
- Gestão completa de Investimentos e Metas (resgatar, listar, filtrar, criar, editar e remover)
- Diferentes tipos de gráficos que possibilitam análisar e comparar a fundo, transações, entradas, saidas, investimentos e metas
- Upload de arquivos anexos às transações
- Design system consistente e responsivo (Tailwind CSS)
- Tipagem estática com TypeScript
- Centralização de regras de negócio e cálculos em hooks e utils compartilhados

## 🛠️ Tecnologias

- React
- TypeScript
- Webpack 5 Module Federation
- Tailwind CSS
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

## 🚀 Como Executar Localmente

### Pré-requisitos

- Node.js (versão 18+ recomendada)
- npm ou yarn
- Git
- Docker Desktop (opcional, para ambiente containerizado)

### 📦 Instalação das Dependências

Como este é um monorepo de microfrontends, **é necessário instalar as dependências de cada aplicação separadamente**:

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
cd investments-mfe && npm install && cd ..
cd shared && npm install && cd ..
cd upload-server && npm install && cd ..
```

### 🏃‍♂️ Execução

Após instalar todas as dependências, execute na raiz do repositório:

```bash
# Inicie tudo de uma vez (API + Upload Server + Shared + Dashboard + Transactions + Investments + Shell)
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

# Shared Library (porta 3033)
npm run dev:shared

# Dashboard MFE (porta 3031)
npm run dev:dashboard

# Transactions MFE (porta 3032)
npm run dev:transactions

# Investments MFE (porta 3036)
npm run dev:investments

# Shell - aplicação principal (porta 3030)
npm run dev:shell
```

**⚠️ Importante:** Os MFEs devem estar rodando **antes** do Shell para que a integração via Module Federation funcione corretamente.

**🌐 Acesso:** Quando todos estiverem rodando, acesse: [http://localhost:3030](http://localhost:3030)

## 🐳 Ambiente com Docker

Para facilitar o desenvolvimento isolado ou integrado, adicionamos uma estrutura Docker pensada em hot reload e isolamento por serviço.

### Estrutura gerada

- `docker/Dockerfile.frontend` — base Node 22 + webpack dev server para os MFEs e o Shell.
- `docker/Dockerfile.node` — imagem Node 22 para o servidor de upload.
- `docker/Dockerfile.jsonserver` + `docker/scripts/api-entrypoint.sh` — `json-server` com setup automático do `db.json` a partir do template.
- `docker/docker-compose.dev.yml` — orquestra shell, MFEs, shared, API mock e upload server.

### Pré-requisitos

- Docker Desktop (ou engine) >= 24 com Compose V2.
- Porta 3030-3036 liberadas no host.
- (Opcional) Execute `npm run setup:db` uma vez para garantir a presença de `db.json` antes do primeiro build; se não existir, o entrypoint da API cria a partir do template.

### Subir apenas um serviço

Você pode abrir um único serviço e suas dependências básicas em modo interativo:

```bash
docker compose -f docker/docker-compose.dev.yml up shell
```

Esse comando inicia `shared`, `dashboard`, `transactions`, `investments`, `api` e `upload` automaticamente por causa do `depends_on`, além do próprio Shell.

Para iniciar outro MFE em isolamento, aponte para o serviço correspondente. Exemplo para o investments:

```bash
docker compose -f docker/docker-compose.dev.yml up investments shared api upload
```

### Subir toda a stack de uma vez

```bash
docker compose -f docker/docker-compose.dev.yml up
```

Use `-d` para rodar em segundo plano. Para desligar, utilize `Ctrl+C` ou `docker compose down` com o mesmo arquivo.

### Hot reload e volumes

- O código-fonte de cada pacote é montado como volume (`./<pacote>:/app`), permitindo que alterações locais reflitam instantaneamente nos containers.
- `node_modules` fica dentro do container via volume anônimo (`/app/node_modules`) para evitar conflito com as máquinas host.
- O diretório `uploads/` é montado em `/uploads` dentro do container, preservando anexos enviados.
- O `json-server` utiliza o volume nomeado `docker_db-data`, evitando travamentos de I/O com o host. O conteúdo inicial é carregado a partir de `db.template.json`.

### Leituras complementares

- [Fluxos de Trabalho no Docker](./docs/docker-workflow.md) — Rebuild de imagens, checklist pós-`git pull` e passo a passo por sistema operacional.
- [JSON Server Guide](./docs/json-server-guide.md) — Dicas para inspeção de volume, exportação e reset do `db.json`.
- [Troubleshooting](./docs/troubleshooting.md) — Diagnóstico rápido para erros comuns em desenvolvimento.
- [Limpeza do Ambiente](./docs/environment-cleanup.md) — Scripts e boas práticas para limpeza completa dos pacotes.

## 🧪 Testes

O projeto conta com uma suíte completa de testes automatizados cobrindo todos os microfrontends e utilitários compartilhados.

### Cobertura de Testes

| Módulo               | Arquivos de Teste | Total de Testes | Status               |
|----------------------|-------------------------------------|----------------------|
| **Shared**           | 2    | 25 testes                    | ✅ Todos passando   |
| **Shell App**        | 1    | 7 testes                     | ✅ Todos passando   |
| **Dashboard MFE**    | 1    | 11 testes                    | ✅ Todos passando   |
| **Transactions MFE** | 1    | 14 testes                    | ✅ Todos passando   |
| **Investments MFE**  | 1    | 18 testes                    | ✅ Todos passando   |
| **TOTAL**            | **6**| **75 testes**                | **✅ 100% passando**|

### 🏃‍♂️ Executando os Testes

```bash
# Executa os testes em todos os módulos
npm run test:all
```

**Executar testes por módulo específico:**

```bash
# Testes do módulo shared
cd shared && npm test

# Testes do Shell App
cd shell && npm test

# Testes do Dashboard MFE
cd dashboard-mfe && npm test

# Testes do Transactions MFE
cd transactions-mfe && npm test

# Testes do Investments MFE
cd investments-mfe && npm test
```

**Modo de desenvolvimento (watch mode):**

```bash
npm run test:watch
```

**Relatórios de cobertura:**

```bash
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
| Investments MFE    | 3036  | [http://localhost:3036](http://localhost:3036) |

## 📜 Scripts Disponíveis

### Instalação e Setup
- `npm run install:all` — Instala dependências em todos os projetos (raiz, shell, MFEs e shared)
- `npm run setup:db` — Cria db.json a partir do template se não existir

### Desenvolvimento
- `npm run dev:all` — Inicia todos os serviços em paralelo
- `npm run dev:shell` — Inicia apenas o Shell
- `npm run dev:dashboard` — Inicia apenas o Dashboard MFE
- `npm run dev:transactions` — Inicia apenas o Transactions MFE
- `npm run dev:investments` — Inicia apenas o Investments MFE
- `npm run dev:shared` — Inicia apenas a Shared Library
- `npm run dev:api` — Inicia apenas o JSON Server (API mock)
- `npm run dev:upload` — Inicia apenas o Upload Server

### Testes
- `npm test` — Executa todos os testes de todos os módulos
- `npm run test:shared` — Testes apenas do módulo shared
- `npm run test:shell` — Testes apenas do Shell App
- `npm run test:dashboard` — Testes apenas do Dashboard MFE
- `npm run test:transactions` — Testes apenas do Transactions MFE
- `npm run test:investments` — Testes apenas do Investments MFE
- `npm run test:watch` — Modo watch para todos os módulos (desenvolvimento)
- `npm run test:coverage` — Gera relatórios de cobertura para todos os módulos

## 🧩 Escopo da Fase 2 (Resumo)

- Evolução para microfrontends com integração via Module Federation
- Separação de responsabilidades por MFE e biblioteca compartilhada
- Integração com API mock para fluxo de transações, investimentos, metas e dashboard
- Reutilização de componentes, hooks e utilitários entre MFEs
- Centralização de regras de negócio e cálculos

## 🛑 Encerrando a Execução

Para encerrar, use `Ctrl + C` no(s) terminal(is) em execução. Se estiver rodando tudo junto com `npm run dev:all`, interrompa no terminal desse comando.

## 🔧 Troubleshooting

Consulte os documentos em `docs/` para dúvidas, problemas comuns e dicas de manutenção:
- [Troubleshooting](./docs/troubleshooting.md) (checklist rápido de erros comuns, comandos úteis e links para guias complementares.)
- [Troubleshooting de Testes](./docs/testing-troubleshooting.md) (questões específicas relacionadas à execução de testes)
- [Limpeza do Ambiente](./docs/environment-cleanup.md) (detalhes dos scripts disponíveis e orientações sobre quando utilizá-los)
- [JSON Server Guide](./docs/json-server-guide.md) (detalhes operacionais do mock de API utilizado)