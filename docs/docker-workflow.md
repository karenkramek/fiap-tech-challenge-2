# Fluxos de Trabalho no Docker

Este guia centraliza os procedimentos opcionais (porém recomendados) ao trabalhar com os containers definidos em `docker/docker-compose.dev.yml`.

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

1. Reinstale as dependências para todos os pacotes:

   ```bash
   npm run install:all
   ```

2. (Opcional) Faça uma limpeza completa antes de reinstalar:

   ```bash
   ./clean-all.sh
   npm run install:all
   ```

3. Reconstrua todas as imagens Docker:

   ```bash
   docker compose -f docker/docker-compose.dev.yml build
   ```

4. Suba os serviços atualizados em segundo plano:

   ```bash
   docker compose -f docker/docker-compose.dev.yml up -d
   ```

5. Verifique o status geral:

   ```bash
   docker compose -f docker/docker-compose.dev.yml ps
   ```

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
