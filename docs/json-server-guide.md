# Guia do JSON Server

Este documento reúne os detalhes operacionais do mock de API utilizado no projeto (`json-server`). Ele cobre como os dados são provisionados, onde ficam armazenados e quais comandos ajudam a inspecionar ou resetar o estado.

## Estrutura de arquivos

- **`db.template.json`** — Arquivo modelo versionado no Git. Serve como "estado base" e é utilizado para recriar o banco local sempre que necessário.
- **`db.json`** — Arquivo gerado automaticamente a partir do template. É ignorado pelo Git e persiste apenas no ambiente local (host ou volume Docker).

## Provisionamento automático

Sempre que o `json-server` é iniciado via scripts npm ou Docker, o entrypoint verifica se existe um `db.json`. Caso não exista, ele copia o conteúdo de `db.template.json`.

```bash
# Cria (ou recria) o db.json a partir do template manualmente
npm run setup:db
```

## Reset rápido no ambiente local

```bash
rm db.json
npm run setup:db
```

## Operações úteis no Docker

Estas ações assumem que você está utilizando o `docker/docker-compose.dev.yml`.

### Inspecionar o volume nomeado

```bash
docker volume inspect docker_db-data
```

### Exportar o banco em execução para a raiz do projeto

```bash
docker cp docker-api-1:/data/db.json ./db.json
```

Atenção: o nome do container (`docker-api-1`) pode variar se você alterar o `project name` do Compose.

### Resetar o mock usando Docker

```bash
docker compose -f docker/docker-compose.dev.yml down
```

```bash
docker volume rm docker_db-data
```

```bash
docker compose -f docker/docker-compose.dev.yml up -d api
```

Se o Compose V2 não estiver disponível, substitua `docker compose` por `docker-compose` nos comandos acima.

## Rotina de inspeção rápida

1. Verifique se os serviços estão ativos:

   ```bash
   curl http://localhost:3034/accounts | head
   ```

2. Faça um POST de teste (exemplo simplificado):

   ```bash
   curl -X POST http://localhost:3034/transactions \
     -H "Content-Type: application/json" \
     -d '{"amount": 10, "type": "deposit", "description": "Teste"}'
   ```

3. Confirme se o volume foi persistido corretamente:

   ```bash
   docker compose -f docker/docker-compose.dev.yml logs api
   ```

Essa rotina ajuda a identificar rapidamente problemas de escrita ocasionados por permissões do host ou conflitos de volume.
