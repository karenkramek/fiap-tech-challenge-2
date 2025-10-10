# 🔒 Práticas de Segurança em Ambientes Cloud

Este documento detalha as práticas de segurança, autenticação e autorização implementadas no projeto ByteBank, conforme requisitos do Tech Challenge.

---

## 📋 Índice

1. [Autenticação e Autorização](#autenticação-e-autorização)
2. [Segurança em Cloud (Vercel)](#segurança-em-cloud-vercel)
3. [Segurança em Cloud (AWS EC2)](#segurança-em-cloud-aws-ec2)
4. [Proteção de Dados](#proteção-de-dados)
5. [Boas Práticas Implementadas](#boas-práticas-implementadas)

---

## 🔐 Autenticação e Autorização

### 1. Sistema de Autenticação Implementado

#### Autenticação baseada em Email/Senha
- **Local:** `shared/src/store/authSlice.ts`
- **Funcionalidades:**
  - Login com email e senha
  - Logout
  - Persistência de sessão (localStorage)
  - Gerenciamento de estado com Redux Toolkit

```typescript
// Fluxo de autenticação
export const login = createAsyncThunk<
  AccountData,
  { email: string; password: string },
  { rejectValue: string }
>(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const account = await AccountService.login(email, password);
      return account;
    } catch (error: any) {
      return rejectWithValue('Email ou senha incorretos');
    }
  }
);
```

#### Serviço de Contas
- **Local:** `shared/src/services/AccountService.ts`
- **Responsabilidades:**
  - Criação de contas com validação
  - Autenticação de usuários
  - Verificação de credenciais

---

### 2. Proteção de Rotas (Route Guards)

#### Hook Customizado de Proteção
- **Local:** `shared/src/hooks/useAuthProtection.ts`
- **Funcionalidades:**
  - Verificação de autenticação
  - Lista de rotas públicas (whitelist)
  - Redirecionamento automático
  - Feedback visual (toasts)

```typescript
export function useAuthProtection(
  currentPath: string,
  config: AuthConfig = {}
): AuthCheckResult {
  const { isAuthenticated, currentUser, loading } = useAccount();

  const isPublicRoute = useMemo(() => {
    return publicRoutes.some(route => {
      if (route.endsWith('/*')) {
        const basePath = route.slice(0, -2);
        return currentPath.startsWith(basePath);
      }
      return currentPath === route;
    });
  }, [currentPath, publicRoutes]);

  return {
    isAuthenticated,
    shouldRedirect: !loading && !isAuthenticated && !isPublicRoute,
    // ...
  };
}
```

#### Componente de Rota Protegida
- **Local:** `shell/src/components/ProtectedRoute.tsx`
- **Uso:**

```tsx
<ProtectedRoute>
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/transactions" element={<TransactionsPage />} />
</ProtectedRoute>
```

#### Rotas Públicas (Não Requerem Autenticação)
```typescript
export const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/features',
  '/login',
  '/register'
] as const;
```

#### Rotas Protegidas (Requerem Autenticação)
- `/dashboard` - Visualização de saldo e resumo financeiro
- `/transactions` - Gestão de transações
- Todas as outras rotas não listadas em PUBLIC_ROUTES

---

## ☁️ Segurança em Cloud (Vercel)

### 1. HTTPS Automático
- ✅ **SSL/TLS certificado automático** gerenciado pela Vercel
- ✅ **Redirect HTTP → HTTPS** configurado automaticamente
- ✅ **HSTS (HTTP Strict Transport Security)** habilitado

### 2. CORS (Cross-Origin Resource Sharing)
- **Local:** `*/vercel.json` (todos os projetos MFE)
- **Configuração:**

```json
{
  "headers": [
    {
      "source": "/remoteEntry.js",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, OPTIONS"
        }
      ]
    }
  ]
}
```

### 3. Variáveis de Ambiente Seguras
- ✅ **Secrets gerenciados** via Vercel Dashboard
- ✅ **Não commitadas** no repositório (.env no .gitignore)
- ✅ **Separação por ambiente** (Production, Preview, Development)

```bash
# Exemplos de variáveis de ambiente (NÃO commitadas)
REACT_APP_API_BASE_URL=/api
REACT_APP_UPLOAD_URL=/api/upload
```

> **Nota:** Use URLs relativas no Vercel. O código detecta automaticamente se já contém `/api/upload` para evitar duplicação. O proxy do Vercel redireciona para o EC2.

### 4. Content Security Policy (CSP)
- ✅ Proteção contra XSS (Cross-Site Scripting)
- ✅ Controle de origens permitidas para Module Federation

### 5. DDoS Protection
- ✅ **Proteção automática** contra ataques DDoS via Vercel Edge Network
- ✅ **Rate limiting** configurado automaticamente

---

## 🖥️ Segurança em Cloud (AWS EC2)

### 1. Security Groups (Firewall)
- ✅ **Apenas portas necessárias abertas:**
  - Porta 22 (SSH) - Apenas para IP específico (administração)
  - Porta 3034 (API) - Acesso HTTP
  - Porta 3035 (Upload) - Acesso HTTP

**Configuração recomendada:**
```bash
# Criar Security Group
aws ec2 create-security-group \
  --group-name bytebank-backend-sg \
  --description "Security group for ByteBank backend"

# SSH apenas do seu IP
aws ec2 authorize-security-group-ingress \
  --group-name bytebank-backend-sg \
  --protocol tcp \
  --port 22 \
  --cidr <SEU_IP>/32

# API pública
aws ec2 authorize-security-group-ingress \
  --group-name bytebank-backend-sg \
  --protocol tcp \
  --port 3034 \
  --cidr 0.0.0.0/0

# Upload público
aws ec2 authorize-security-group-ingress \
  --group-name bytebank-backend-sg \
  --protocol tcp \
  --port 3035 \
  --cidr 0.0.0.0/0
```

### 2. Autenticação SSH com Chave Privada
- ✅ **Acesso via chave privada** (.pem) ao invés de senha
- ✅ **Chave não commitada** no repositório (.gitignore)
- ✅ **Permissões restritas** (chmod 400)

```bash
# Configuração da chave
chmod 400 bytebank-key.pem
ssh -i bytebank-key.pem ubuntu@44.206.72.128
```

### 3. IAM (Identity and Access Management)
- ✅ **Princípio do menor privilégio**
- ✅ **Credenciais AWS não no código** (AWS CLI configurado localmente)

### 4. Container Isolation (Docker)
- ✅ **Isolamento de processos** via containers
- ✅ **Rede isolada** entre containers (bytebank-network)
- ✅ **Volumes montados** com permissões restritas

```yaml
# docker-compose.backend.yml
networks:
  bytebank-network:
    driver: bridge

services:
  api:
    networks:
      - bytebank-network
    # Apenas portas necessárias expostas
```

### 5. Updates e Patches
- ✅ **Base image Ubuntu LTS** (Long Term Support)
- ✅ **Node.js Alpine** (imagens Docker minimalistas)
- ✅ **Atualizações regulares** via CI/CD

---

## 🛡️ Proteção de Dados

### 1. Dados Sensíveis
- ✅ **Senhas armazenadas** (em produção, usar bcrypt/hash)
- ⚠️ **Recomendação:** Implementar hash de senha antes de produção real

```typescript
// Recomendação para produção:
import bcrypt from 'bcrypt';

// Ao criar conta
const hashedPassword = await bcrypt.hash(password, 10);

// Ao fazer login
const isValid = await bcrypt.compare(password, user.hashedPassword);
```

### 2. Sanitização de Inputs
- ✅ **Validação de email** no frontend
- ✅ **Validação de dados** antes de persistir
- ✅ **Escape de HTML** em React (automático)

### 3. LocalStorage
- ✅ **Dados do usuário persistidos** localmente
- ⚠️ **Recomendação:** Usar JWT tokens com expiração em produção

```typescript
// Estado atual
localStorage.setItem('authUser', JSON.stringify(user));

// Recomendação para produção:
// Usar JWT com refresh token e expiração
```

---

## ✅ Boas Práticas Implementadas

### 1. Princípio do Menor Privilégio
- ✅ Usuários não autenticados só acessam rotas públicas
- ✅ Containers Docker com permissões mínimas necessárias
- ✅ Security Groups AWS com regras específicas

### 2. Defesa em Profundidade (Defense in Depth)
- ✅ **Camada de Aplicação:** Proteção de rotas + validação
- ✅ **Camada de Rede:** Security Groups + CORS
- ✅ **Camada de Transporte:** HTTPS (Vercel) + SSH (EC2)
- ✅ **Camada de Dados:** Validação + sanitização

### 3. Separação de Ambientes
- ✅ **Frontend (Vercel):** Stateless, CDN global, HTTPS automático
- ✅ **Backend (AWS EC2):** Stateful, recursos dedicados, firewall

### 4. CI/CD Seguro
- ✅ **Secrets no GitHub Actions** (DOCKER_HUB_TOKEN)
- ✅ **Build automático** sem credenciais hardcoded
- ✅ **Deploy segregado** por target (vercel/aws)

```yaml
# .github/workflows/docker-build-push.yml
- name: Login to Docker Hub
  uses: docker/login-action@v3
  with:
    username: ${{ env.DOCKER_USERNAME }}
    password: ${{ secrets.DOCKER_HUB_TOKEN }}  # Secret seguro
```

### 5. Logging e Monitoramento
- ✅ **Logs de autenticação** (login/logout)
- ✅ **Docker logs** para debugging
- ✅ **Error tracking** via toast notifications

---

## 📊 Checklist de Conformidade

| Requisito | Status | Implementação |
|-----------|--------|---------------|
| Autenticação de usuários | ✅ | authSlice.ts + AccountService |
| Autorização (proteção de rotas) | ✅ | ProtectedRoute + useAuthProtection |
| HTTPS em produção | ✅ | Vercel (automático) |
| Firewall/Security Groups | ✅ | AWS EC2 Security Groups |
| Autenticação SSH com chave | ✅ | bytebank-key.pem |
| Secrets gerenciados | ✅ | Vercel Env Vars + GitHub Secrets |
| CORS configurado | ✅ | vercel.json headers |
| Container isolation | ✅ | Docker + Docker Compose |
| Validação de inputs | ✅ | Frontend + Backend |
| Princípio do menor privilégio | ✅ | Route guards + IAM |

---

## 🚀 Melhorias Recomendadas para Produção

### Alta Prioridade
1. **Implementar hash de senhas** (bcrypt)
2. **JWT tokens** com refresh e expiração
3. **Rate limiting** na API (express-rate-limit)
4. **Audit logs** para ações sensíveis

### Média Prioridade
5. **2FA (Two-Factor Authentication)**
6. **AWS ALB/ELB** com SSL certificate
7. **WAF (Web Application Firewall)**
8. **Backup automático** do db.json

### Baixa Prioridade
9. **Security headers** adicionais (X-Frame-Options, etc.)
10. **Penetration testing**
11. **SIEM integration**

---

## 📚 Referências

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [AWS Security Best Practices](https://aws.amazon.com/architecture/security-identity-compliance/)
- [Vercel Security](https://vercel.com/docs/security)
- [Docker Security](https://docs.docker.com/engine/security/)

---

**Última atualização:** Outubro 2025
**Responsável:** Karen Kramek
**Projeto:** FIAP Tech Challenge 2 - ByteBank
