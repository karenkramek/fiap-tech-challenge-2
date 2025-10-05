# Fix: Porta 3034 não iniciando no Docker

## Problema

Quando tentando executar a aplicação via Docker, o serviço da API (JSON Server) na porta 3034 não conseguia iniciar, apresentando o seguinte erro:

```
api-1  | exec /usr/local/bin/api-entrypoint.sh: no such file or directory
api-1 exited with code 255
```

## Causa Raiz

O problema estava no `docker/Dockerfile.jsonserver`. O container estava configurado para usar um `ENTRYPOINT` apontando para um script externo (`api-entrypoint.sh`) que não conseguia ser executado corretamente dentro do container Alpine Linux. Isso pode ocorrer devido a:

1. **Problemas de terminação de linha**: Diferenças entre terminações de linha Windows (CRLF) vs Unix (LF)
2. **Problemas de contexto de build**: O script não estava sendo copiado corretamente para o container
3. **Questões de permissão**: Mesmo com `chmod +x`, o script pode não ter as permissões adequadas no ambiente Alpine

## Solução Implementada

### Antes (Problemático)
```dockerfile
COPY docker/scripts/api-entrypoint.sh /usr/local/bin/api-entrypoint.sh
RUN chmod +x /usr/local/bin/api-entrypoint.sh
ENTRYPOINT ["/usr/local/bin/api-entrypoint.sh"]
```

### Depois (Funcional)
```dockerfile
CMD sh -c '[ ! -f /data/db.json ] && [ -f /data/db.template.json ] && cp /data/db.template.json /data/db.json && echo "Created db.json from template."; json-server --watch /data/db.json --host 0.0.0.0 --port ${PORT}'
```

### Mudanças Realizadas

1. **Removido o script externo**: Eliminamos a dependência do arquivo `api-entrypoint.sh`
2. **Comando inline**: A lógica de inicialização agora está diretamente no `CMD` do Dockerfile
3. **Simplificação**: Menos pontos de falha e maior compatibilidade entre sistemas

## Arquivo Completo Corrigido

```dockerfile
FROM node:22-alpine

WORKDIR /app

RUN npm install -g json-server@1.0.0-beta.3

# Create data directory
RUN mkdir -p /data

# Copy template from the build context
COPY db.template.json /data/db.template.json

ENV PORT=3034
ENV DATA_DIR=/data

EXPOSE ${PORT}

# Use simple shell command to setup and run json-server
CMD sh -c '[ ! -f /data/db.json ] && [ -f /data/db.template.json ] && cp /data/db.template.json /data/db.json && echo "Created db.json from template."; json-server --watch /data/db.json --host 0.0.0.0 --port ${PORT}'
```

## Como Aplicar a Correção

### 1. Rebuild do Container
```bash
# Navegue até o diretório raiz do projeto
cd /path/to/TechChallenge2

# Faça rebuild do container da API sem cache
docker compose -f docker/docker-compose.dev.yml build --no-cache api
```

### 2. Teste Individual da API
```bash
# Inicie apenas o serviço da API em background
docker compose -f docker/docker-compose.dev.yml up api -d

# Teste se a API está respondendo
curl http://localhost:3034/accounts

# Deve retornar:
# [
#   {
#     "id": "acc001",
#     "name": "Fulana de Tal",
#     "email": "fulana@email.com",
#     "password": "senha123",
#     "balance": 2530
#   }
# ]
```

### 3. Execução Completa da Stack
```bash
# Inicie todos os serviços
docker compose -f docker/docker-compose.dev.yml up

# Ou em background
docker compose -f docker/docker-compose.dev.yml up -d
```

## Verificação de Sucesso

Quando a API estiver funcionando corretamente, você verá no log:

```
api-1  | Created db.json from template.
api-1  | --watch/-w can be omitted, JSON Server 1+ watches for file changes by default
api-1  | JSON Server started on PORT :3034
api-1  | Press CTRL-C to stop
api-1  | Watching /data/db.json...
api-1  |
api-1  | ♡( ◡‿◡ )
api-1  |
api-1  | Index:
api-1  | http://localhost:3034/
api-1  |
api-1  | Endpoints:
api-1  | http://0.0.0.0:3034/transactions
api-1  | http://0.0.0.0:3034/accounts
```

## Alternativas

### Execução sem Docker
Se ainda houver problemas com Docker, você pode usar a execução nativa:

```bash
# Instale todas as dependências
npm run install:all

# Execute todos os serviços
npm run dev:all
```

### Debug de Containers
Para debugar problemas futuros:

```bash
# Verifique logs do container
docker compose -f docker/docker-compose.dev.yml logs api

# Acesse shell do container para investigação
docker run --rm -it --entrypoint /bin/sh docker-api:latest

# Verifique status dos containers
docker compose -f docker/docker-compose.dev.yml ps
```

## Benefícios da Solução

1. **Maior Confiabilidade**: Elimina dependências de arquivos externos
2. **Compatibilidade Cross-Platform**: Funciona igual em Windows, macOS e Linux
3. **Manutenção Simplificada**: Menos arquivos para gerenciar
4. **Debug Mais Fácil**: A lógica está visível diretamente no Dockerfile

## Prevenção de Problemas Futuros

- **Sempre teste localmente**: Execute `docker compose build --no-cache` após mudanças
- **Use comandos inline**: Para lógicas simples, prefira comandos inline ao invés de scripts externos
- **Verifique logs**: Use `docker compose logs <service>` para diagnosticar problemas
- **Mantenha volumes**: O volume `db-data` garante persistência dos dados entre rebuilds

---

**Data da Correção**: Outubro 2025
**Versão Docker Compose**: 2.x
**Versão JSON Server**: 1.0.0-beta.3
