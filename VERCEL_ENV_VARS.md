# Variáveis de Ambiente para Deploy no Vercel

## 📋 Configuração por Projeto

### 1. Shell (Aplicação Principal)
```
REACT_APP_DASHBOARD_URL=https://bytebank-dashboard.vercel.app
REACT_APP_TRANSACTIONS_URL=https://bytebank-transactions.vercel.app
REACT_APP_SHARED_URL=https://bytebank-shared.vercel.app
REACT_APP_API_BASE_URL=/api
REACT_APP_UPLOAD_URL=/uploads
```

> ⚠️ **Importante:** As URLs `/api` e `/uploads` são **caminhos relativos** que funcionam através do **proxy configurado no Vercel**. O `vercel.json` de cada projeto redireciona essas requisições para o backend EC2 (44.206.72.128:3034 e :3035), resolvendo problemas de mixed content (HTTPS ↔ HTTP).

### 2. Dashboard MFE
```
REACT_APP_API_BASE_URL=/api
REACT_APP_SHARED_URL=https://bytebank-shared.vercel.app
```

### 3. Transactions MFE
```
REACT_APP_API_BASE_URL=/api
REACT_APP_UPLOAD_URL=/uploads
REACT_APP_SHARED_URL=https://bytebank-shared.vercel.app
```

### 4. Shared Library
```
REACT_APP_API_BASE_URL=/api
```

---

## 🚀 Como Configurar no Vercel

1. Acesse o projeto no Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione cada variável acima
4. Clique em **Save**
5. **Redeploy** o projeto

---

## ⚠️ IMPORTANTE

Depois que fazer o primeiro deploy no Vercel, você receberá as URLs reais:
- Shell: `https://fiap-tech-challenge-2-shell.vercel.app` (ou similar)
- Dashboard: `https://fiap-tech-challenge-2-dashboard.vercel.app`
- Transactions: `https://fiap-tech-challenge-2-transactions.vercel.app`
- Shared: `https://fiap-tech-challenge-2-shared.vercel.app`

**Atualize as URLs acima** com as URLs reais que o Vercel gerar!

---

## 🔄 Ordem de Deploy

1. **Deploy Shared primeiro** (outros dependem dele)
2. **Deploy Dashboard**
3. **Deploy Transactions**
4. **Deploy Shell** (por último, pois depende de todos)

Depois que todos estiverem no ar, atualize as variáveis de ambiente com as URLs corretas e faça redeploy!
