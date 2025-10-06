# Troubleshooting

Use esta referência quando encontrar problemas recorrentes no ambiente de desenvolvimento.

## Module Federation / "Module not found"

- Garanta que `shared`, `dashboard-mfe` e `transactions-mfe` estejam rodando antes do `shell`.
- Verifique se as portas 3030-3035 estão livres:

  ```bash
  lsof -i :3030
  ```

  No Windows, utilize:

  ```powershell
  netstat -an | findstr :3030
  ```

## Dependências ausentes

Execute o instalador global para todos os pacotes:

```bash
npm run install:all
```

Se o problema persistir, considere rodar a limpeza completa (ver [`docs/environment-cleanup.md`](./environment-cleanup.md)).

## Cache do npm corrompido

```bash
npm cache clean --force
```

## Problemas com versão do Node.js

- Utilize Node.js 18+
- Se estiver usando `nvm`, rode:

  ```bash
  nvm use 18
  ```

## Conflitos de porta

1. Identifique qual processo está utilizando a porta.
2. Finalize o processo conflitante ou altere a porta no arquivo de configuração do serviço.

## Problemas com Testes

Para problemas específicos relacionados à execução de testes, consulte o guia dedicado:

📖 **Guia completo:** Ver [Troubleshooting de Testes](./testing-troubleshooting.md)

**Problemas mais comuns:**
- Erro "Cannot resolve module 'shared/...'"
- "matchMedia is not a function"
- "IntersectionObserver is not defined"
- Warnings de `act()` em testes React
- Timeouts em testes assíncronos

## JSON Server sem persistir dados

- Verifique se o volume `docker_db-data` está criado e montado.
- Confira os logs do serviço:

  ```bash
  docker compose -f docker/docker-compose.dev.yml logs api
  ```

- Consulte o [guia completo do JSON Server](./json-server-guide.md) para passos de reset e inspeção do volume.
