# Shared MFE (Design System & Utils)

Este pacote é um micro front-end (MFE) compartilhado, focado em fornecer componentes, hooks, serviços, tipos, tokens e presets do Tailwind para outros MFEs do monorepo.

## Como consumir

### 1. Componentes React
Importe diretamente do remote:
```js
import Button from 'shared/components/Button';
import Card from 'shared/components/Card';
// ...outros componentes
```

### 2. Hooks
```js
import useTransactions from 'shared/hooks/useTransactions';
import useAccount from 'shared/hooks/useAccount';
// ...outros hooks
```

### 3. Serviços/API
```js
import { AccountService } from 'shared/services/AccountService';
import { TransactionService } from 'shared/services/TransactionService';
```

### 4. Tipos/DTOs
```js
import { TransactionType } from 'shared/types/TransactionType';
import { TransactionDTO } from 'shared/dtos/Transaction.dto';
```

### 5. Utils
```js
import { formatCurrencyWithSymbol } from 'shared/utils/currencyUtils';
```

### 6. Tokens e preset do Tailwind
- `tokens.css`: tokens de design (cores, espaçamentos, etc.)
- `tailwind.preset.js`: preset compartilhado para configuração do Tailwind.

Exemplo de uso no seu `tailwind.config.js`:
```js
const sharedPreset = require('shared/tailwind.preset');
module.exports = {
  presets: [sharedPreset],
  // ...outras configs
};
```

## Observações
- O arquivo `index.ts` não é exposto via Module Federation, pois serve apenas para bootstrap local.
- Para adicionar novos componentes/utilitários, siga o padrão de exportação e registre no `webpack.config.js`.

## Desenvolvimento
- Rode o MFE shared localmente para testar alterações isoladas.
- Utilize os tokens e preset para garantir consistência visual entre MFEs.

---