# 🌐 Arquitetura de Deployment Híbrida - Vercel + AWS

Este documento explica a estratégia de deployment do ByteBank, que utiliza uma **arquitetura híbrida multi-cloud** para otimizar custos, performance e escalabilidade.

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Por que Arquitetura Híbrida?](#por-que-arquitetura-híbrida)
3. [Arquitetura Implementada](#arquitetura-implementada)
4. [Vercel - Frontends](#vercel---frontends)
5. [AWS EC2 - Backend](#aws-ec2---backend)
6. [Fluxo de Deployment](#fluxo-de-deployment)

---

## 🎯 Visão Geral

O ByteBank utiliza uma estratégia de **separação de responsabilidades por cloud provider**, aproveitando os pontos fortes de cada plataforma:

| Componente | Cloud Provider | Justificativa |
|------------|----------------|---------------|
| **4 Frontends MFE** | Vercel (Free) | CDN global, HTTPS automático, build otimizado |
| **2 Backend APIs** | AWS EC2 (Free) | Controle completo, persistência de dados |

**Resultado:**
- ✅ **100% em free tier** (sem custos)
- ✅ **Performance otimizada** (CDN Vercel + EC2 dedicado)
- ✅ **Escalabilidade** (cada serviço pode escalar independentemente)

---

## 🤔 Por que Arquitetura Híbrida?

### Problema Inicial: EC2 t3.micro Limitado

Quando tentamos fazer deploy completo (6 containers) na AWS EC2 t3.micro (free tier):

```
Recursos EC2 t3.micro:
- RAM: 914 MB total
- vCPU: 2 cores

Uso com 6 containers (Shell + Dashboard + Transactions + Shared + API + Upload):
- RAM utilizada: ~700 MB (77% da capacidade)
- Resultado: Servidor ficou "impaired" (deteriorado)
- webpack-dev-server consumindo muita memória
```

**Problema:** Os **frontends com webpack-dev-server** consomem muita RAM, inviabilizando o uso de uma única instância EC2 free tier.

### Solução: Separação Inteligente

```
Frontends (Webpack = pesado) → Vercel (especializado em frontends)
Backend (API = leve)          → AWS EC2 (controle total)
```

**Benefícios:**
1. ✅ **Vercel faz o build pesado** (webpack, otimizações, minificação)
2. ✅ **EC2 roda apenas 2 containers leves** (~150 MB de RAM, 84% de economia)
3. ✅ **Frontends servidos via CDN global** (latência baixa mundial)
4. ✅ **HTTPS automático** sem custo de certificado
5. ✅ **Deploy automático** via GitHub integration

---

## 🏗️ Arquitetura Implementada

### Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             CLIENTE (Browser)                              │
└───────────────┬───────────────────────────────┬────────────────────────────┘
                │                               │
                │ HTTPS                         │ HTTPS
                ▼                               ▼
        ┌─────────────────────┐         ┌─────────────────────┐
        │     Vercel CDN      │         │     Vercel CDN      │
        │     (US/Global)     │         │     (US/Global)     │
        └──────────┬──────────┘         └──────────┬──────────┘
                   │                               │
                   ▼                               ▼
        ┌────────────────────────┐     ┌────────────────────────┐
        │   Shell (Host)         │     │   Dashboard MFE        │
        │   vercel.app           │◄────┤   vercel.app           │
        │   Module Federation    │     │   remoteEntry.js       │
        └────────────────────────┘     └────────────────────────┘
                   │
                   ▼
        ┌────────────────────────┐     ┌────────────────────────┐
        │   Transactions MFE     │     │   Shared Library       │
        │   vercel.app           │◄────┤   vercel.app           │
        │   remoteEntry.js       │     │   remoteEntry.js       │
        └────────────────────────┘     └────────────────────────┘
                   │
                   │ HTTP (API calls)
                  ▼
        ┌─────────────────────────────────────────────────────────────┐
        │                  AWS EC2 (us-east-1)                       │
        │                  IP: 44.206.72.128                         │
        │   ┌──────────────────┐     ┌──────────────────┐            │
        │   │  API Container   │     │ Upload Container │            │
        │   │  Port: 3034      │     │ Port: 3035       │            │
        │   │  JSON Server     │     │ Express + Multer │            │
        │   └──────────────────┘     └──────────────────┘            │
        │           │                      │                        │
        │           ▼                      ▼                        │
        │      db.json              uploads/ folder                  │
└─────────────────────────────────────────────────────────┘
```

### Componentes e URLs

#### Frontends (Vercel)
- **Shell:** https://bytebank-shell.vercel.app
  - Orquestra os MFEs via Module Federation
  - CDN global, HTTPS, deploy automático

- **Dashboard MFE:** https://dashboard-mfe-eta.vercel.app
  - Microfrontend de Dashboard
  - Expõe `remoteEntry.js` para consumo do Shell

- **Transactions MFE:** https://transactions-mfe-iota.vercel.app
  - Microfrontend de Transações
  - Expõe `remoteEntry.js` para consumo do Shell

- **Shared Library:** https://bytebank-shared.vercel.app
  - Componentes, hooks e utilitários compartilhados
  - Consumido por todos os MFEs

#### Backend (AWS EC2)
- **API Server:** http://44.206.72.128:3034
  - JSON Server (mock database)
  - Endpoints: `/transactions`, `/accounts`
  - Persistência em `db.json`

- **Upload Server:** http://44.206.72.128:3035
  - Express + Multer para upload de arquivos
  - Endpoints: `/api/upload`, `/uploads/:filename`
  - Persistência em pasta `uploads/`

---

## 🚀 Vercel - Frontends

### Configuração de Cada Projeto

Cada MFE tem seu próprio projeto Vercel com configurações específicas:

#### 1. Shared Library
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": null,
  "rootDirectory": "shared"
}
```

Variáveis de ambiente:
```bash
REACT_APP_API_BASE_URL=/api
```

> **Nota:** A URL `/api` é um **caminho relativo** que usa o proxy configurado no `vercel.json`. O Vercel redireciona automaticamente requisições de `/api/*` para `http://44.206.72.128:3034/*`, resolvendo problemas de mixed content entre HTTPS (Vercel) e HTTP (EC2).

#### 2. Dashboard MFE
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": null,
  "rootDirectory": "dashboard-mfe"
}
```

Variáveis de ambiente:
```bash
REACT_APP_API_BASE_URL=/api
REACT_APP_SHARED_URL=https://bytebank-shared.vercel.app
REACT_APP_DASHBOARD_URL=https://dashboard-mfe-eta.vercel.app
REACT_APP_TRANSACTIONS_URL=https://transactions-mfe-iota.vercel.app
```

#### 3. Transactions MFE
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": null,
  "rootDirectory": "transactions-mfe"
}
```

Variáveis de ambiente:
```bash
REACT_APP_API_BASE_URL=/api
REACT_APP_UPLOAD_URL=/uploads
REACT_APP_SHARED_URL=https://bytebank-shared.vercel.app
REACT_APP_DASHBOARD_URL=https://dashboard-mfe-eta.vercel.app
REACT_APP_TRANSACTIONS_URL=https://transactions-mfe-iota.vercel.app
```

> **Nota:** O caminho `/uploads` também usa proxy do Vercel, redirecionando para `http://44.206.72.128:3035/uploads/*`.

#### 4. Shell (Host)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": null,
  "rootDirectory": "shell"
}
```

Variáveis de ambiente:
```bash
REACT_APP_API_BASE_URL=/api
REACT_APP_UPLOAD_URL=/uploads
REACT_APP_SHARED_URL=https://bytebank-shared.vercel.app
REACT_APP_DASHBOARD_URL=https://dashboard-mfe-eta.vercel.app
REACT_APP_TRANSACTIONS_URL=https://transactions-mfe-iota.vercel.app
```

### Module Federation no Vercel

O Webpack Module Federation funciona perfeitamente no Vercel graças à configuração de CORS:

```json
// vercel.json em cada MFE
{
  "headers": [
    {
      "source": "/remoteEntry.js",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

Isso permite que o Shell carregue dinamicamente os remotes de outros MFEs.

---

## 🖥️ AWS EC2 - Backend

### Por que AWS EC2 para Backend?

1. **Controle Total**
   - Acesso SSH completo
   - Customização de ambiente
   - Instalação de qualquer software

2. **Persistência de Dados**
   - `db.json` persistido no volume EC2
   - `uploads/` pasta com arquivos anexos
   - Backup manual facilitado

### Configuração EC2

**Instância:**
- Type: t3.micro
- OS: Ubuntu 22.04 LTS
- RAM: 914 MB (2 containers = ~150 MB)
- vCPU: 2 cores
- Region: us-east-1 (N. Virginia)
- IP público: 44.206.72.128

**Security Group:**
```bash
# Porta 22 (SSH) - Restrita ao IP do administrador
Port: 22
Protocol: TCP
Source: <SEU_IP>/32

# Porta 3034 (API) - Pública
Port: 3034
Protocol: TCP
Source: 0.0.0.0/0

# Porta 3035 (Upload) - Pública
Port: 3035
Protocol: TCP
Source: 0.0.0.0/0
```

### Docker Compose (Backend Only)

docker/docker-compose.backend.yml

**Características:**
- ✅ Apenas 2 containers (API + Upload)
- ✅ Volumes persistentes (db.json + uploads)
- ✅ Restart automático se container falhar
- ✅ Rede isolada entre containers

---

## 🔄 Fluxo de Deployment

### 1. Deploy Automático - Frontends (Vercel)

```
Developer → Push to GitHub → Vercel Webhook → Build → Deploy → CDN
```

**Processo:**
1. Developer faz push/merge na branch `main`
2. Vercel detecta mudança via webhook
3. Faz build do projeto (`npm run build`)
4. Distribui para CDN global
5. Novo deployment disponível em ~2-3 minutos

### 2. Deploy Semi-Automático - Backend (AWS EC2)

```
Developer → Push to GitHub → GitHub Actions → Docker Hub → Manual Pull EC2
```

**Processo:**
1. Developer faz push/merge na branch `main`
2. GitHub Actions builda imagens Docker
3. Push automático para Docker Hub
4. **Administrador faz pull manual no EC2:**

```bash
# SSH no EC2
ssh -i bytebank-key.pem ubuntu@44.206.72.128

# Ir para o projeto
cd ~/fiap-tech-challenge-2

# Atualizar código
git pull origin main

# Parar containers
docker-compose -f docker/docker-compose.backend.yml down

# Puxar novas imagens
docker-compose -f docker/docker-compose.backend.yml pull

# Subir containers atualizados
docker-compose -f docker/docker-compose.backend.yml up -d

# Verificar status
docker-compose -f docker/docker-compose.backend.yml ps
```

**Por que não automatizar completamente o backend?**
- ✅ Evita deploys acidentais em produção
- ✅ Permite validação manual antes de subir
- ✅ Controle sobre momento do downtime (se necessário)
