# 📋 Sistema de Banco de Dados Local

Este projeto utiliza um sistema de banco de dados modelo que mantém dados de exemplo no repositório e permite desenvolvimento local sem afetar o Git.

## 🎯 Como Funciona

### **Arquivos:**
- **`db.template.json`** → Arquivo modelo commitado no Git
- **`db.json`** → Arquivo local (ignorado pelo Git) para desenvolvimento

### **Fluxo:**
1. **`db.template.json`** é versionado e compartilhado
2. **`db.json`** é criado automaticamente a partir do template **APENAS se não existir**
3. **Se `db.json` já existe, ele é preservado** - seus dados locais ficam intactos
4. Mudanças em **`db.json`** ficam apenas localmente
5. Dados de teste não são commitados acidentalmente

## 🚀 Uso

### **Desenvolvimento Normal:**
```bash
npm run dev:all
```
*Automaticamente cria `db.json` **APENAS** se não existir e inicia todos os serviços*
*Se o arquivo já existe, **preserva seus dados locais** e apenas inicia os serviços*

### **Resetar Dados (voltar ao template) - OPCIONAL:**
```bash
# ⚠️ ATENÇÃO: Isso apaga seus dados locais!
# Apaga o arquivo local
rm db.json
# Ou no Windows:
del db.json

# Recria do template
npm run setup:db
```
*Use apenas se quiser **descartar** seus dados locais e voltar ao template*

### **Atualizar Template (quando necessário):**
```bash
# 1. Faça as mudanças desejadas em db.json
# 2. Copie para o template:
cp db.json db.template.json
# 3. Commite apenas o template:
git add db.template.json
git commit -m "feat: atualizar dados modelo"
```

## 📁 Estrutura

```
📦 projeto/
├── 📄 db.template.json    ← Modelo (commitado)
├── 📄 db.json            ← Local (ignorado)
├── 📄 .gitignore         ← Ignora db.json
└── 📄 package.json       ← Scripts automatizados
```

## ⚠️ Importante

- **NUNCA** commite `db.json` diretamente
- **SEMPRE** atualize `db.template.json` quando quiser mudar dados modelo
- O arquivo `db.json` é **ignorado pelo Git** automaticamente
- Novos desenvolvedores recebem dados limpos automaticamente
- **Seus dados locais são preservados** - o script nunca sobrescreve `db.json` existente
- Para resetar dados, você deve **deletar manualmente** o `db.json` antes

## 🔧 Scripts Disponíveis

- `npm run setup:db` → Cria db.json do template (apenas se não existir)
- `npm run dev:all` → Setup + start completo (preserva dados existentes)
- `npm run dev:api` → Apenas API (json-server)

## 🛡️ Proteção de Dados

### **O sistema NUNCA sobrescreve dados existentes:**

```bash
# Primeira execução (db.json não existe)
npm run dev:all
# → ✅ Cria db.json do template

# Execuções subsequentes (db.json já existe)
npm run dev:all
# → ℹ️ Arquivo db.json já existe. Mantendo dados locais.
# → ✅ Inicia serviços normalmente
```

### **Seus dados estão seguros:**
- ✅ Scripts **detectam** se `db.json` já existe
- ✅ Se existe, **preservam** o arquivo atual
- ✅ Apenas **criam** quando o arquivo não existe
- ✅ **Nunca** deletam ou sobrescrevem dados locais
