# Tech Challenge - Fase 2 - Grupo 28 - 4FRNT

ByteBank - Arquitetura de Microfrontends com Webpack Module Federation.

## 🎯 Contexto da Fase 2

Esta é a evolução do projeto da Fase 1 para a Fase 2 do Tech Challenge (FIAP - Front-end Engineering). Nesta fase avançamos para uma arquitetura de microfrontends, compondo a aplicação a partir de múltiplos MFEs integrados via Module Federation, mantendo os princípios de componentização, reutilização e tipagem estática.

## 🎥 Demo e Design

- 📹 Vídeo de Apresentação (Fase 1 – conceito e UI): [Assista no Loom](https://www.loom.com/share/35534aa22a264f7da957a72e228920e7?sid=1991a61a-66c3-4387-a536-83a96cf53144)
- 🎨 Design no Figma: [Protótipo no Figma](https://www.figma.com/design/Y2JoXXiG50h2nj9FiG71i7/ByteBank-4FRNT---Fase1?node-id=0-1&p=f&t=vmoSPz2lFa4bemW4-0)

## 🧱 Visão da Arquitetura

- Shell App (porta 3030) — Host principal da aplicação
- Dashboard MFE (porta 3031) — Microfrontend de Dashboard
- Transactions MFE (porta 3032) — Microfrontend de Transações
- Shared Library (porta 3033) — Biblioteca compartilhada (componentes, hooks, utils)
- API Server (porta 3034) — Backend mock com JSON Server

Pastas relevantes:

- `shell/`
- `dashboard-mfe/`
- `transactions-mfe/`
- `shared/`

## ✨ Funcionalidades

- Dashboard intuitivo com saldo e extrato
- Listagem de transações com visualização, edição e remoção
- Adição de novas transações (depósito, transferência, etc.)
- Edição de transações existentes
- Design system consistente e responsivo (Tailwind CSS)
- Tipagem estática com TypeScript

## 🛠️ Tecnologias

- React
- TypeScript
- Webpack 5 Module Federation
- Tailwind CSS (no `dashboard-mfe` e nos componentes compartilhados conforme aplicável)
- JSON Server (API mock)

## 🚀 Como Executar Localmente

### Pré-requisitos

- Node.js (versão 18+ recomendada)
- npm ou yarn
- Git

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
```

### 🏃‍♂️ Execução

Após instalar todas as dependências, execute na raiz do repositório:

```bash
# Inicie tudo de uma vez (API + Shared + Dashboard + Transactions + Shell)
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

## 🔌 Portas

| Serviço            | Porta | URL                       |
|--------------------|-------|---------------------------|
| Shell App          | 3030  | [http://localhost:3030](http://localhost:3030) |
| Dashboard MFE      | 3031  | [http://localhost:3031](http://localhost:3031) |
| Transactions MFE   | 3032  | [http://localhost:3032](http://localhost:3032) |
| Shared Library     | 3033  | [http://localhost:3033](http://localhost:3033) |
| API Server (Mock)  | 3034  | [http://localhost:3034](http://localhost:3034) |

## 📜 Scripts Disponíveis

- `npm run install:all` — Instala dependências em todos os projetos (raiz, shell, MFEs e shared)
- `npm run dev:all` — Inicia todos os serviços em paralelo
- `npm run dev:shell` — Inicia apenas o Shell
- `npm run dev:dashboard` — Inicia apenas o Dashboard MFE
- `npm run dev:transactions` — Inicia apenas o Transactions MFE
- `npm run dev:shared` — Inicia apenas a Shared Library
- `npm run dev:api` — Inicia apenas o JSON Server (API mock)

## 🧩 Escopo da Fase 2 (Resumo)

- Evolução para microfrontends com integração via Module Federation
- Separação de responsabilidades por MFE e biblioteca compartilhada
- Integração com API mock para fluxo de transações e dashboard
- Reutilização de componentes, hooks e utilitários entre MFEs

## 🛑 Encerrando a Execução

Para encerrar, use `Ctrl + C` no(s) terminal(is) em execução. Se estiver rodando tudo junto com `npm run dev:all`, interrompa no terminal desse comando.

## 🔧 Troubleshooting

### Problemas Comuns

**1. Erro "Module not found" ou problemas de Module Federation:**

- Certifique-se de que todos os MFEs estão rodando antes do Shell
- Verifique se as portas estão livres (3030-3034)
- Execute `npm run dev:shared` primeiro, depois os demais MFEs

**2. Dependências não instaladas:**

```bash
# Execute este comando para instalar tudo de uma vez
npm run install:all
```

**3. Conflitos de porta:**

- Verifique se as portas 3030-3034 estão livres
- No macOS/Linux: `lsof -i :3030` para verificar o uso da porta
- No Windows: `netstat -an | findstr :3030`

**4. Cache de módulos:**

```bash
# Limpe o cache do npm se houver problemas
npm cache clean --force
```

**5. Problemas com Node.js:**

- Use Node.js versão 18+
- Considere usar nvm: `nvm use 18`
