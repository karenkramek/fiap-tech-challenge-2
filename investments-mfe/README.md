# 📈 Investments MFE

Micro front-end responsável pela área de investimentos do ByteBank.

---

## 🚀 Como rodar localmente

```bash
npm install
npm run dev
```

Acesse: http://localhost:3036

---

## 📁 Estrutura
- `src/components/` — Componentes de UI e domínio
- `src/hooks/` — Hooks customizados
- `src/utils/` — Funções utilitárias
- `src/types/` — Tipos e interfaces
- `src/__tests__/` — Testes automatizados (Jest + Testing Library)
- `src/__mocks__/` — Mocks para testes

---

## 🧪 Testes

- Para rodar os testes:
  ```bash
  npm test
  ```
- Os testes seguem o padrão dos outros MFEs do monorepo.
- Adicione novos testes em `src/__tests__`.

---

## 🛠️ Integração com Shared

Utilize componentes, hooks e serviços do pacote `shared` para garantir consistência visual e de regras de negócio entre os MFEs.

Exemplo de importação:
```js
import Button from 'shared/components/ui/Button';
import { useAccount } from 'shared/hooks/useAccount';
import { formatCurrencyWithSymbol } from 'shared/utils/currency';
```

---

## 💡 Dicas & Boas Práticas
- Siga o padrão de tipagem e organização dos outros MFEs.
- Use sempre os tokens e o preset do shared para garantir consistência visual.
- Para integração com outros MFEs, utilize Module Federation.
- Consulte o README do `shared` para exemplos e padrões.

---

Dúvidas? Consulte o README do `shared` ou abra uma issue!
