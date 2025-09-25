# 📦 Shared MFE — Design System & Utils

Bem-vindo ao pacote compartilhado do ByteBank! Aqui você encontra componentes, hooks, serviços, tipos, tokens e presets do Tailwind para uso em todos os MFEs do monorepo.

---

## 🚀 Como usar

### 1. Componentes React
Importe diretamente do remote:
```js
import Button from 'shared/components/ui/Button';
import Card from 'shared/components/ui/Card';
import ConfirmationModal from 'shared/components/ui/ConfirmationModal';
import TransactionList from 'shared/components/domain/transaction/TransactionList';
import { AttachmentDisplay, FilePreviewModal, FileUpload } from 'shared/components/domain/file';
import BalanceCard from 'shared/components/domain/BalanceCard';
// ...e outros!
```

### 2. Hooks
```js
import useTransactions from 'shared/hooks/useTransactions';
import useAccount from 'shared/hooks/useAccount';
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

### 6. Tokens & Preset do Tailwind
- `tokens.css`: tokens de design (cores, espaçamentos, etc.)
- `tailwind.preset.js`: preset compartilhado para configuração do Tailwind

Exemplo de uso no seu `tailwind.config.js`:
```js
const sharedPreset = require('shared/tailwind.preset');
module.exports = {
  presets: [sharedPreset],
  // ...outras configs
};
```

---

## 💡 Dicas & Boas Práticas
- Rode o MFE shared localmente para testar alterações isoladas.
- Use sempre os tokens e o preset para garantir consistência visual entre MFEs.
- Para adicionar novos componentes/utilitários, siga o padrão de exportação e registre no `webpack.config.js`.
- O arquivo `index.ts` não é exposto via Module Federation (apenas para bootstrap local).

---

Ficou com dúvida? Consulte o time ou abra uma issue! 😉
