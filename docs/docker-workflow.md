# Fluxos de Trabalho no Docker

Este guia centraliza os procedimentos opcionais (porém recomendados) ao trabalhar com os containers definidos em `docker/docker-compose.dev.yml`.

## Estrutura dos arquivos Docker

- `docker/Dockerfile.frontend` — base Node 22 + webpack dev server para os MFEs e o Shell.
- `docker/Dockerfile.node` — imagem Node 22 para o servidor de upload.
- `docker/Dockerfile.jsonserver` — `json-server` com setup automático do `db.json` a partir do template (via comando inline).
- `docker/docker-compose.dev.yml` — orquestra shell, MFEs, shared, API mock e upload server.

## Comandos úteis

### Subir todos os serviços

```bash
docker compose -f docker/docker-compose.dev.yml up
```

Use `-d` para rodar em segundo plano (detached):

```bash
docker compose -f docker/docker-compose.dev.yml up -d
```

### Subir apenas um serviço específico

```bash
docker compose -f docker/docker-compose.dev.yml up shell
```

Esse comando inicia `shared`, `dashboard`, `transactions`, `api` e `upload` automaticamente por causa do `depends_on`.

Para outros serviços:

```bash
docker compose -f docker/docker-compose.dev.yml up dashboard
docker compose -f docker/docker-compose.dev.yml up transactions
docker compose -f docker/docker-compose.dev.yml up api
```

### Parar os serviços

```bash
docker compose -f docker/docker-compose.dev.yml down
```

### Ver logs

**Todos os serviços:**

```bash
docker compose -f docker/docker-compose.dev.yml logs -f
```

**Serviço específico:**

```bash
docker compose -f docker/docker-compose.dev.yml logs -f shell
docker compose -f docker/docker-compose.dev.yml logs -f api
```

### Ver status dos containers

```bash
docker compose -f docker/docker-compose.dev.yml ps
```

### Acessar o shell de um container

```bash
docker compose -f docker/docker-compose.dev.yml exec shell sh
docker compose -f docker/docker-compose.dev.yml exec api sh
```

## Hot reload e volumes

- O código-fonte de cada pacote é montado como volume (`./<pacote>:/app`), permitindo que alterações locais reflitam instantaneamente nos containers.
- `node_modules` fica dentro do container via volume anônimo (`/app/node_modules`) para evitar conflito com as máquinas host.
- O diretório `uploads/` é montado em `/uploads` dentro do container, preservando anexos enviados.
- O `json-server` utiliza o volume nomeado `docker_db-data`, evitando travamentos de I/O com o host. O conteúdo inicial é carregado a partir de `db.template.json`.

## Rebuild após atualizar dependências

Quando um `package.json` é alterado, reconstrua a imagem do serviço correspondente e reinicie o container para garantir que as novas dependências estão presentes.

```bash
docker compose -f docker/docker-compose.dev.yml build shell
```

```bash
docker compose -f docker/docker-compose.dev.yml up shell
```

> Substitua `shell` pelo serviço desejado (`dashboard`, `transactions`, `shared`, `api`, `upload`).

## Checklist após `git pull`

### ✅ Opção 1: Reset completo (Recomendado)

**Use este método sempre após um `git pull` para garantir um ambiente limpo e sem conflitos.**

Este procedimento remove todos os artefatos antigos e reconstrói o ambiente do zero, evitando erros de cache, dependências desatualizadas ou problemas de volume.

1. Limpe todos os arquivos de lock e node_modules:

   ```bash
   # macOS/Linux
   ./clean-all.sh

   # Windows
   .\clean-all.bat
   ```

2. Derrube todos os containers:

   ```bash
   docker compose -f docker/docker-compose.dev.yml down
   ```

3. Remova o volume do banco de dados mock:

   ```bash
   docker volume rm docker_db-data
   ```

4. Reinstale todas as dependências:

   ```bash
   npm run install:all
   ```

5. Reconstrua todas as imagens Docker (isso também recria o mock a partir do `db.template.json`):

   ```bash
   docker compose -f docker/docker-compose.dev.yml build
   ```

6. Suba os serviços novamente:

   ```bash
   docker compose -f docker/docker-compose.dev.yml up -d
   ```

7. Verifique se tudo está rodando corretamente:

   ```bash
   docker compose -f docker/docker-compose.dev.yml ps
   ```

> ✅ **Vantagem:** Garante um ambiente 100% consistente com o repositório atualizado.

### Opção 2: Atualização rápida (apenas quando necessário)

Use este método **somente** quando tiver certeza de que as mudanças são mínimas (ex: apenas ajustes no código-fonte, sem alteração em dependências ou estrutura).

1. Reinstale as dependências para todos os pacotes:

   ```bash
   npm run install:all
   ```

2. Reconstrua todas as imagens Docker:

   ```bash
   docker compose -f docker/docker-compose.dev.yml build
   ```

3. Suba os serviços atualizados em segundo plano:

   ```bash
   docker compose -f docker/docker-compose.dev.yml up -d
   ```

4. Verifique o status geral:

   ```bash
   docker compose -f docker/docker-compose.dev.yml ps
   ```

> ⚠️ **Atenção:** Se encontrar erros, volte e execute a Opção 1 (Reset completo).

## Passo a passo por sistema operacional

### macOS / Linux (Docker Desktop ou Colima)

1. Certifique-se de que o engine está ativo:

   ```bash
   colima start
   docker info
   ```

   (Se estiver usando Docker Desktop, basta abrir o aplicativo e aguardar o status "Running").

2. Suba a stack completa:

   ```bash
   docker compose -f docker/docker-compose.dev.yml up -d
   ```

   Se a máquina ainda utiliza Compose V1, troque por `docker-compose`.

3. Consulte o status:

   ```bash
   docker compose -f docker/docker-compose.dev.yml ps
   ```

4. Acesse a aplicação em <http://localhost:3030>.

5. Para resetar o mock, execute:

   ```bash
   docker compose -f docker/docker-compose.dev.yml down
   docker volume rm docker_db-data
   docker compose -f docker/docker-compose.dev.yml up -d api
   ```

6. Para limpeza completa do ambiente local:

   ```bash
   ./clean-all.sh
   npm run install:all
   ```

### Windows 10/11 (Docker Desktop + WSL2)

1. Confirme que o Docker Desktop está rodando com backend WSL2 e que o drive com o projeto está compartilhado.

2. No terminal (PowerShell, Windows Terminal, Git Bash ou dentro da distro WSL2), instale as dependências se necessário:

   ```powershell
   npm run install:all
   ```

3. Suba os containers em background:

   ```powershell
   docker-compose -f docker/docker-compose.dev.yml up -d
   ```

   Quando Compose V2 estiver disponível, `docker compose` também funciona.

4. Consulte o status:

   ```powershell
   docker-compose -f docker/docker-compose.dev.yml ps
   ```

5. Abra o Shell App em <http://localhost:3030>.

6. Para limpeza:

   ```powershell
   .\clean-all.bat
   npm run install:all
   ```

7. Para resetar o mock no Windows:

   ```powershell
   docker-compose -f docker/docker-compose.dev.yml down
   docker volume rm docker_db-data
   docker-compose -f docker/docker-compose.dev.yml up -d api
   ```
