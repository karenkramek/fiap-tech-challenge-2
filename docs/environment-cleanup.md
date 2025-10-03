# Limpeza do Ambiente

Procedimentos opcionais para remover `node_modules`, arquivos de build e caches de todos os pacotes do monorepo.

## Scripts disponíveis

### Linux / macOS

```bash
./clean-all.sh
```

### Windows

```powershell
clean-all.bat
```

Ambos os scripts executam as seguintes etapas:

1. Removem `node_modules`, `dist`, `build` e `package-lock.json` de cada pacote.
2. Limpam o cache do npm com `npm cache clean --force`.
3. Recriam diretórios vazios necessários para futuras instalações.

## Pós limpeza

Após rodar o script, reinstale as dependências necessárias:

```bash
npm run install:all
```

## Dicas

- Execute os scripts de limpeza apenas quando estiver enfrentando problemas persistentes de dependências ou cache.
- Caso utilize Docker, limpe o ambiente local antes de reconstruir as imagens para evitar inconsistências.
