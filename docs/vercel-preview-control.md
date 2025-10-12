# 🚀 Controle de Preview Deploys no Vercel

Este documento explica as estratégias implementadas para gerenciar os deploys de preview no Vercel.

## 📋 Problema

Por padrão, o Vercel cria um deploy de preview automaticamente para cada:
- Pull Request aberto
- Commit em branch que não é production
- Cada push em PRs abertos

Isso pode gerar muitos deploys desnecessários, consumir cota da conta e criar ruído nas notificações.

## ✅ Solução Implementada

### Configuração nos arquivos `vercel.json`

Adicionamos a seguinte configuração em todos os projetos:

```json
{
  "git": {
    "deploymentEnabled": {
      "main": true
    }
  },
  "github": {
    "silent": true,
    "autoJobCancelation": true
  }
}
```

### O que cada opção faz:

#### 1. `git.deploymentEnabled`
```json
"git": {
  "deploymentEnabled": {
    "main": true
  }
}
```
- ✅ **Faz deploy APENAS da branch `main`**
- ❌ **Não faz deploy de PRs, branches de feature, etc.**
- 💡 Você pode adicionar outras branches se necessário:
```json
"deploymentEnabled": {
  "main": true,
  "develop": true,
  "staging": true
}
```

#### 2. `github.silent`
```json
"github": {
  "silent": true
}
```
- 🔕 **Desabilita comentários automáticos do Vercel nos PRs**
- Reduz spam de notificações
- O deploy ainda acontece (se configurado), mas sem comentários

#### 3. `github.autoJobCancelation`
```json
"github": {
  "autoJobCancelation": true
}
```
- ⚡ **Cancela deploys anteriores quando um novo push acontece**
- Economiza tempo e recursos
- Evita fila de builds desnecessários

## 🎯 Outras Estratégias Disponíveis

### Opção A: Ignorar Build Baseado em Condições (Mais Granular)

Adicione um script que determina quando fazer build:

1. Crie um script `scripts/vercel-ignore-build.sh`:

```bash
#!/bin/bash

# Ignora build para branches que não sejam main
if [ "$VERCEL_GIT_COMMIT_REF" != "main" ]; then
  echo "🚫 Ignorando build - Branch não é main"
  exit 0
fi

# Ignora se apenas arquivos .md foram alterados
git diff HEAD^ HEAD --quiet -- '*.md' && exit 0

# Faz o build
echo "✅ Fazendo build"
exit 1
```

2. No `vercel.json`:

```json
{
  "ignoreCommand": "bash scripts/vercel-ignore-build.sh"
}
```

### Opção B: Configuração via Dashboard do Vercel

Para cada projeto:

1. Acesse **Settings** → **Git**
2. Configure:
   - **Production Branch**: `main`
   - **Preview Deployments**: Desmarque se não quiser nenhum preview
   - **Automatic Deployments from Pull Requests**: Desmarque para desabilitar

### Opção C: Branches Específicas com Padrão

Para fazer deploy apenas de branches específicas:

```json
{
  "git": {
    "deploymentEnabled": {
      "main": true,
      "release/*": true,
      "hotfix/*": true
    }
  }
}
```

Suporta padrões glob para branches.

## 📊 Comparação de Estratégias

| Estratégia | Facilidade | Flexibilidade | Recomendado para |
|------------|-----------|---------------|------------------|
| **git.deploymentEnabled** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | Projetos simples, apenas main |
| **ignoreCommand script** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Controle granular, condições complexas |
| **Dashboard Vercel** | ⭐⭐⭐⭐⭐ | ⭐⭐ | Configuração rápida, sem código |
| **Branch patterns** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Deploy de múltiplas branches específicas |

## 🔄 Fluxo Atual Implementado

Com a configuração atual:

```
┌─────────────────┐
│  Commit/Push    │
└────────┬────────┘
         │
         ├─ Branch main ────────────────► ✅ Deploy em Produção
         │
         ├─ Branch feature/xyz ─────────► ❌ Sem deploy
         │
         ├─ Pull Request aberto ────────► ❌ Sem deploy de preview
         │
         └─ Push em PR ─────────────────► ❌ Sem deploy de preview
```

## 📝 Quando Fazer Deploy Manual de Preview

Se você precisar testar uma branch específica antes do merge:

### Método 1: Via Vercel CLI
```bash
# Instale o CLI
npm i -g vercel

# Deploy da branch atual
vercel

# Deploy com alias customizado
vercel --alias my-feature-test
```

### Método 2: Via Dashboard
1. Acesse o projeto no Vercel
2. Clique em **"New Deployment"**
3. Selecione a branch desejada
4. Click **"Deploy"**

### Método 3: Habilitar temporariamente
1. Vá em **Settings** → **Git**
2. Marque temporariamente **"Preview Deployments"**
3. Faça o push
4. Desmarque novamente após o teste

## 🎓 Benefícios da Configuração Atual

✅ **Economia de recursos** - Menos builds = menos uso de cota
✅ **Menos ruído** - Sem comentários automáticos em PRs
✅ **Builds mais rápidos** - Cancelamento automático de builds anteriores
✅ **Controle claro** - Deploy apenas quando merge em main
✅ **CI/CD limpo** - Menos checks no GitHub
✅ **Foco em produção** - Preview apenas quando realmente necessário

## ⚠️ Considerações

- **Code Review**: Sem preview automático, revise o código com mais atenção antes do merge
- **Testes locais**: Garanta que testes passam localmente antes do push para main
- **Hotfixes**: Se precisar testar urgente, use Vercel CLI para deploy manual
- **Staging**: Considere criar uma branch `staging` no `deploymentEnabled` se necessário

## 🔍 Verificando a Configuração

Para verificar se está funcionando:

1. Abra um PR em uma branch feature
2. Verifique que o Vercel não comenta no PR
3. Verifique no dashboard do Vercel que não há deploy de preview
4. Ao fazer merge na main, o deploy acontece normalmente

## 📚 Referências

- [Vercel Git Configuration](https://vercel.com/docs/projects/project-configuration#git-configuration)
- [Vercel Ignored Build Step](https://vercel.com/docs/concepts/projects/overview#ignored-build-step)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)

---

**Status**: ✅ Configuração ativa em todos os projetos (shell, dashboard-mfe, transactions-mfe, investments-mfe, shared)

**Última atualização**: Outubro 2025
