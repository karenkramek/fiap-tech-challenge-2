# Variáveis de Ambiente para Deploy no Vercel

## 📋 Configuração por Projeto

### 1. Shell (Aplicação Principal)
```
REACT_APP_DASHBOARD_URL=https://dashboard-mfe-eta.vercel.app
REACT_APP_TRANSACTIONS_URL=https://transactions-mfe-iota.vercel.app
REACT_APP_INVESTMENTS_URL=https://investments-mfe.vercel.app
REACT_APP_SHARED_URL=https://bytebank-shared.vercel.app
REACT_APP_API_BASE_URL=/api
REACT_APP_UPLOAD_URL=/api/upload
```

> ⚠️ **Importante sobre UPLOAD_URL:**

> - Use **`/api/upload`** (URL relativa que o proxy redireciona)
> - O código detecta automaticamente se já tem `/api/upload` para evitar duplicação
> - Para downloads, o código usa o `filePath` retornado (ex: `/uploads/file.pdf`)
> - O proxy no `vercel.json` redireciona:
>   - `/api/upload/*` → EC2:3035
>   - `/uploads/*` → EC2:3035

### 2. Dashboard MFE
```
REACT_APP_API_BASE_URL=/api
REACT_APP_SHARED_URL=https://bytebank-shared.vercel.app
REACT_APP_INVESTMENTS_URL=https://investments-mfe.vercel.app
```

### 3. Transactions MFE
```
REACT_APP_API_BASE_URL=/api
REACT_APP_UPLOAD_URL=/api/upload
REACT_APP_SHARED_URL=https://bytebank-shared.vercel.app
REACT_APP_INVESTMENTS_URL=https://investments-mfe.vercel.app
```

> **Nota:** `REACT_APP_UPLOAD_URL` usa `/api/upload` (mesmo comportamento do Shell).

### 4. Investments MFE
```
REACT_APP_API_BASE_URL=/api
REACT_APP_SHARED_URL=https://bytebank-shared.vercel.app
```

### 5. Shared Library
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
- Investments: `https://investments-mfe.vercel.app`
- Shared: `https://fiap-tech-challenge-2-shared.vercel.app`

**Atualize as URLs acima** com as URLs reais que o Vercel gerar!

---

## 🔄 Ordem de Deploy

1. **Deploy Shared primeiro** (outros dependem dele)
2. **Deploy Dashboard**
3. **Deploy Transactions**
4. **Deploy Investments**
5. **Deploy Shell** (por último, pois depende de todos)

Depois que todos estiverem no ar, atualize as variáveis de ambiente com as URLs corretas e faça redeploy!
