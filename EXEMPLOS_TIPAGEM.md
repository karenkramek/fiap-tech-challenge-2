# Guia Prático: Como Usar a Tipagem Estática

Este documento fornece exemplos práticos de como usar as melhorias de tipagem implementadas no projeto.

## 📚 Índice

1. [Validação de Dados](#validação-de-dados)
2. [Type Guards](#type-guards)
3. [Serviços Tipados](#serviços-tipados)
4. [Interfaces e DTOs](#interfaces-e-dtos)
5. [Hooks Tipados](#hooks-tipados)
6. [Componentes React](#componentes-react)
7. [Tratamento de Erros](#tratamento-de-erros)
8. [Utilitários e Helpers](#utilitários-e-helpers)

---

## 1. Validação de Dados

### ✅ Validando uma transação antes de enviar

```typescript
import { validateObject, ValidationSchemas } from 'shared/utils/validation';
import { TransactionType } from 'shared/types/TransactionType';

// Dados do formulário
const transactionData = {
  amount: 150.50,
  type: TransactionType.DEPOSIT,
  date: new Date(),
  description: 'Depósito salário'
};

// Validação tipada
const { isValid, errors } = validateObject(transactionData, ValidationSchemas.transaction);

if (!isValid) {
  console.log('Erros encontrados:', errors);
  // errors.amount - string com erro do valor (se houver)
  // errors.type - string com erro do tipo (se houver)
  // etc.
} else {
  // Dados válidos, pode prosseguir
  console.log('Dados válidos!');
}
```

### ✅ Validação de conta

```typescript
import { ValidationSchemas } from 'shared/utils/validation';

const accountData = {
  name: 'Conta Corrente',
  balance: 1000.00
};

const validation = validateObject(accountData, ValidationSchemas.account);

if (validation.isValid) {
  // Criar conta
} else {
  // Mostrar erros no formulário
  Object.entries(validation.errors).forEach(([field, error]) => {
    console.log(`${field}: ${error}`);
  });
}
```

### ✅ Validações personalizadas

```typescript
import { ValidationUtils } from 'shared/utils/validation';

// Validação de email
const email = 'usuario@exemplo.com';
if (ValidationUtils.isEmail(email)) {
  console.log('Email válido');
}

// Validação de valor monetário
const amount = 999.99;
if (ValidationUtils.isValidAmount(amount)) {
  console.log('Valor válido para transação');
}

// Criando regras customizadas
const customRule = {
  validate: (value: string) => value.includes('@'),
  message: 'Deve conter @'
};
```

---

## 2. Type Guards

### ✅ Verificando dados vindos de API

```typescript
import { isTransactionDTO } from 'shared/dtos/Transaction.dto';
import { isAccountDTO } from 'shared/dtos/Account.dto';

// Resposta da API (tipo any ou unknown)
async function fetchData() {
  const response = await fetch('/api/transactions/123');
  const data = await response.json();

  // Type guard garante tipagem
  if (isTransactionDTO(data)) {
    // TypeScript agora sabe que data é TransactionDTO
    console.log(data.amount); // ✅ Propriedade existe e é number
    console.log(data.type);   // ✅ Propriedade existe e é TransactionType

    // Converter para modelo
    const transaction = Transaction.fromJSON(data);
    console.log(transaction.getFormattedAmount()); // ✅ Método existe
  } else {
    console.error('Dados inválidos recebidos da API');
  }
}
```

### ✅ Validando dados de localStorage

```typescript
import { isITransaction } from 'transactions-mfe/src/interfaces/Transaction.interface';

function loadFromStorage() {
  const stored = localStorage.getItem('lastTransaction');

  if (stored) {
    try {
      const parsed = JSON.parse(stored);

      // Converte string de volta para Date
      if (parsed.date) {
        parsed.date = new Date(parsed.date);
      }

      if (isITransaction(parsed)) {
        // Dados válidos e tipados
        console.log('Última transação:', parsed.description);
        return parsed;
      }
    } catch (error) {
      console.error('Erro ao processar dados salvos');
    }
  }

  return null;
}
```

---

## 3. Serviços Tipados

### ✅ Usando TransactionService

```typescript
import { TransactionService } from 'shared/services/TransactionService';
import { TransactionType } from 'shared/types/TransactionType';
import { TransactionFilters } from 'shared/types/api.types';

// Buscar todas as transações
async function loadTransactions() {
  try {
    const transactions = await TransactionService.getAllTransactions();
    // transactions é Transaction[] com tipagem garantida

    transactions.forEach(t => {
      console.log(t.getFormattedAmount()); // ✅ Método disponível
      console.log(t.getFormattedDate());   // ✅ Método disponível
    });
  } catch (error) {
    console.error('Erro ao carregar transações:', error);
  }
}

// Buscar com filtros
async function loadFilteredTransactions() {
  const filters: TransactionFilters = {
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    type: TransactionType.DEPOSIT,
    minAmount: 100,
    page: 1,
    limit: 10
  };

  const transactions = await TransactionService.getAllTransactions(filters);
  return transactions;
}

// Criar nova transação
async function createTransaction() {
  try {
    const newTransaction = await TransactionService.addTransaction(
      TransactionType.DEPOSIT,
      500.00,
      new Date(),
      'Depósito PIX',
      undefined // sem arquivo
    );

    console.log('Transação criada:', newTransaction.id);
    return newTransaction;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro específico:', error.message);
    }
    throw error;
  }
}

// Atualizar transação com arquivo
async function updateWithFile(id: string, file: File) {
  try {
    const updated = await TransactionService.updateTransaction(
      id,
      TransactionType.PAYMENT,
      299.99,
      new Date(),
      'Pagamento cartão',
      file // arquivo anexado
    );

    console.log('Transação atualizada:', updated.toJSON());
  } catch (error) {
    console.error('Falha na atualização:', error);
  }
}
```

### ✅ Usando AccountService

```typescript
import { AccountService } from 'shared/services/AccountService';
import { CreateAccountDTO, UpdateAccountDTO } from 'shared/dtos/Account.dto';

// Buscar conta atual
async function getCurrentAccount() {
  try {
    const account = await AccountService.getAccount();
    console.log(`Saldo atual: ${account.getFormattedBalance()}`);
    return account;
  } catch (error) {
    console.error('Erro ao buscar conta:', error);
    return null;
  }
}

// Criar nova conta
async function createNewAccount() {
  const accountData: CreateAccountDTO = {
    name: 'Minha Conta Poupança',
    initialBalance: 1000.00
  };

  try {
    const account = await AccountService.createAccount(accountData);
    console.log('Conta criada:', account.name);
    return account;
  } catch (error) {
    console.error('Erro ao criar conta:', error);
    throw error;
  }
}

// Atualizar saldo
async function updateBalance(accountId: string, newBalance: number) {
  try {
    const account = await AccountService.updateAccountBalance(accountId, newBalance);
    console.log('Saldo atualizado:', account.balance);
  } catch (error) {
    console.error('Erro ao atualizar saldo:', error);
  }
}
```

### ✅ Upload de arquivos tipado

```typescript
import { FileUploadService } from 'shared/services/FileUploadService';
import { TransactionType } from 'shared/types/TransactionType';

async function handleFileUpload(file: File, transactionType: TransactionType) {
  // Validação prévia
  const validation = FileUploadService.validateFile(file);
  if (!validation.isValid) {
    alert(validation.error);
    return;
  }

  try {
    // Upload tipado
    const filePath = await FileUploadService.uploadFile(file, transactionType);
    console.log('Arquivo enviado para:', filePath);

    // URL para download
    const downloadUrl = FileUploadService.getDownloadUrl(filePath);
    console.log('URL de download:', downloadUrl);

    // Nome formatado
    const displayName = FileUploadService.getFileName(filePath, transactionType);
    console.log('Nome para exibição:', displayName);

    return filePath;
  } catch (error) {
    console.error('Erro no upload:', error);
    throw error;
  }
}

// Verificar se é imagem
function handleFilePreview(filePath: string) {
  if (FileUploadService.isImage(filePath)) {
    // Mostrar preview da imagem
    const url = FileUploadService.getDownloadUrl(filePath);
    return url;
  } else {
    // Mostrar ícone de arquivo
    return null;
  }
}
```

---

## 4. Interfaces e DTOs

### ✅ Trabalhando com models

```typescript
import { Transaction } from 'shared/models/Transaction';
import { Account } from 'shared/models/Account';
import { TransactionType } from 'shared/types/TransactionType';

// Criando uma transação
function createTransaction() {
  try {
    const transaction = new Transaction(
      'tx-001',
      TransactionType.WITHDRAWAL,
      150.00,
      new Date(),
      'Saque ATM',
      undefined
    );

    // Métodos utilitários
    console.log('É despesa?', transaction.isExpense()); // true
    console.log('É receita?', transaction.isIncome());  // false
    console.log('Valor formatado:', transaction.getFormattedAmount());
    console.log('Data formatada:', transaction.getFormattedDate());
    console.log('Tem anexo?', transaction.hasAttachment()); // false

    return transaction;
  } catch (error) {
    console.error('Erro na validação:', error.message);
  }
}

// Trabalhando com conta
function manageAccount() {
  const account = new Account('acc-001', 'Conta Corrente', 1000.00);

  // Métodos de manipulação
  account.addBalance(500.00);     // Saldo: 1500.00
  account.subtractBalance(200.00); // Saldo: 1300.00

  // Verificações
  if (account.hasInsufficientFunds(1500.00)) {
    console.log('Saldo insuficiente');
  }

  // Conversão para DTO
  const dto = account.toJSON();
  console.log('DTO:', dto);
}
```

### ✅ Usando interfaces nos MFEs

```typescript
// Em transactions-mfe
import { ITransaction, ICreateTransaction } from '../interfaces/Transaction.interface';
import { TransactionType } from 'shared/types/TransactionType';

// Dados para criar transação
const createData: ICreateTransaction = {
  type: TransactionType.TRANSFER,
  amount: 300.00,
  date: new Date(),
  description: 'Transferência para poupança'
};

// Função que recebe ITransaction
function processTransaction(transaction: ITransaction) {
  console.log(`Processando transação ${transaction.id}`);
  console.log(`Valor: R$ ${transaction.amount.toFixed(2)}`);

  if (transaction.description) {
    console.log(`Descrição: ${transaction.description}`);
  }

  if (transaction.attachmentPath) {
    console.log(`Anexo: ${transaction.attachmentPath}`);
  }
}
```

---

## 5. Hooks Tipados

### ✅ useTransactions com tipagem

```typescript
import { useTransactions } from 'shared/hooks/useTransactions';
import { TransactionType } from 'shared/types/TransactionType';

function TransactionComponent() {
  const {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    fetchTransactions
  } = useTransactions();

  // Estado tipado automaticamente
  // transactions: Transaction[]
  // loading: boolean
  // error: Error | null

  const handleCreateTransaction = async () => {
    try {
      const newTransaction = await addTransaction(
        TransactionType.DEPOSIT,
        500.00,
        new Date(),
        'Nova transação'
      );
      console.log('Criada:', newTransaction.id);
    } catch (error) {
      console.error('Erro:', error.message);
    }
  };

  const handleUpdateTransaction = async (id: string) => {
    try {
      await updateTransaction(
        id,
        TransactionType.PAYMENT,
        299.99,
        new Date(),
        'Transação atualizada'
      );
    } catch (error) {
      console.error('Erro na atualização:', error);
    }
  };

  const handleDelete = async (id: string) => {
    const success = await deleteTransaction(id);
    if (success) {
      console.log('Transação removida');
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div>
      {transactions.map(transaction => (
        <div key={transaction.id}>
          {transaction.getFormattedAmount()} - {transaction.getFormattedDate()}
        </div>
      ))}
    </div>
  );
}
```

### ✅ useAccount com tipagem

```typescript
import { useAccount } from 'shared/hooks/useAccount';

function AccountComponent() {
  const { account, loading, error, refreshAccount } = useAccount();

  // account: Account | null
  // loading: boolean
  // error: Error | null

  if (loading) return <div>Carregando conta...</div>;
  if (error) return <div>Erro: {error.message}</div>;
  if (!account) return <div>Conta não encontrada</div>;

  return (
    <div>
      <h2>{account.name}</h2>
      <p>Saldo: R$ {account.balance.toFixed(2)}</p>
      <button onClick={refreshAccount}>
        Atualizar
      </button>
    </div>
  );
}
```

---

## 6. Componentes React

### ✅ Props tipadas

```typescript
import React from 'react';
import { Transaction } from 'shared/models/Transaction';
import { TransactionType } from 'shared/types/TransactionType';

// Props bem definidas
interface TransactionCardProps {
  transaction: Transaction;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => Promise<void>;
  showActions?: boolean;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onEdit,
  onDelete,
  showActions = true
}) => {
  // TypeScript garante que transaction é Transaction
  const handleEdit = () => {
    onEdit?.(transaction.id); // Operador opcional tipado
  };

  const handleDelete = async () => {
    if (onDelete) {
      try {
        await onDelete(transaction.id);
      } catch (error) {
        console.error('Erro ao deletar:', error);
      }
    }
  };

  return (
    <div className="transaction-card">
      <h3>{transaction.getFormattedAmount()}</h3>
      <p>{transaction.getFormattedDate()}</p>

      {transaction.description && (
        <p>{transaction.description}</p>
      )}

      {transaction.hasAttachment() && (
        <span>📎 Anexo</span>
      )}

      {showActions && (
        <div>
          <button onClick={handleEdit}>Editar</button>
          <button onClick={handleDelete}>Excluir</button>
        </div>
      )}
    </div>
  );
};

export default TransactionCard;
```

### ✅ Formulários tipados

```typescript
import React, { useState } from 'react';
import { TransactionType } from 'shared/types/TransactionType';
import { validateObject, ValidationSchemas } from 'shared/utils/validation';

interface TransactionFormData {
  amount: number;
  type: TransactionType;
  date: Date;
  description?: string;
}

const TransactionForm: React.FC = () => {
  const [formData, setFormData] = useState<TransactionFormData>({
    amount: 0,
    type: TransactionType.DEPOSIT,
    date: new Date(),
    description: ''
  });

  const [errors, setErrors] = useState<Record<keyof TransactionFormData, string>>({} as any);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação tipada
    const validation = validateObject(formData, ValidationSchemas.transaction);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Limpar erros e enviar
    setErrors({} as any);
    console.log('Dados válidos:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={formData.amount}
        onChange={(e) => setFormData(prev => ({
          ...prev,
          amount: parseFloat(e.target.value) || 0
        }))}
      />
      {errors.amount && <span className="error">{errors.amount}</span>}

      <select
        value={formData.type}
        onChange={(e) => setFormData(prev => ({
          ...prev,
          type: e.target.value as TransactionType
        }))}
      >
        {Object.values(TransactionType).map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>

      <button type="submit">Salvar</button>
    </form>
  );
};
```

---

## 7. Tratamento de Erros

### ✅ Erros tipados dos serviços

```typescript
import { TransactionService } from 'shared/services/TransactionService';

async function handleTransactionCreation() {
  try {
    const transaction = await TransactionService.addTransaction(
      TransactionType.DEPOSIT,
      -100, // Valor inválido propositalmente
      new Date()
    );
  } catch (error) {
    // BaseService já formata erros padronizados
    if (error instanceof Error) {
      if (error.message.includes('400:')) {
        console.log('Erro de validação:', error.message);
      } else if (error.message.includes('500:')) {
        console.log('Erro do servidor:', error.message);
      } else if (error.message.includes('conexão')) {
        console.log('Erro de rede:', error.message);
      } else {
        console.log('Erro desconhecido:', error.message);
      }
    }
  }
}
```

### ✅ Tratamento de erros em componentes

```typescript
import React, { useState } from 'react';
import { useTransactions } from 'shared/hooks/useTransactions';

const TransactionManager: React.FC = () => {
  const { addTransaction } = useTransactions();
  const [operationError, setOperationError] = useState<string | null>(null);

  const handleAddTransaction = async () => {
    try {
      setOperationError(null);

      await addTransaction(
        TransactionType.DEPOSIT,
        1000,
        new Date(),
        'Depósito teste'
      );

      alert('Transação criada com sucesso!');
    } catch (error) {
      // Error tipado do hook
      if (error instanceof Error) {
        setOperationError(error.message);
      } else {
        setOperationError('Erro desconhecido');
      }
    }
  };

  return (
    <div>
      <button onClick={handleAddTransaction}>
        Adicionar Transação
      </button>

      {operationError && (
        <div className="error-message">
          Erro: {operationError}
        </div>
      )}
    </div>
  );
};
```

---

## 8. Utilitários e Helpers

### ✅ Utility types em ação

```typescript
import { Optional, Nullable, AsyncState } from 'shared/types/global.types';
import { Transaction } from 'shared/models/Transaction';

// Transação com campos opcionais
type PartialTransaction = Optional<Transaction, 'description' | 'attachmentPath'>;

// Estado de carregamento
const transactionState: AsyncState<Transaction[]> = {
  data: null,
  loading: true,
  error: null
};

// Valor que pode ser nulo
const selectedTransaction: Nullable<Transaction> = null;

// Função com callback tipado
function processTransactions(
  transactions: Transaction[],
  callback: (transaction: Transaction) => void
) {
  transactions.forEach(callback);
}
```

### ✅ Helpers para formatação

```typescript
import { Transaction } from 'shared/models/Transaction';
import { FileUploadService } from 'shared/services/FileUploadService';

// Formatação de valores
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
}

// Helpers para transações
function getTransactionSummary(transactions: Transaction[]) {
  return {
    total: transactions.length,
    income: transactions.filter(t => t.isIncome()).length,
    expenses: transactions.filter(t => t.isExpense()).length,
    totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
    withAttachments: transactions.filter(t => t.hasAttachment()).length
  };
}

// Helpers para arquivos
function getFileInfo(filePath: string) {
  return {
    name: FileUploadService.getFileName(filePath),
    isImage: FileUploadService.isImage(filePath),
    downloadUrl: FileUploadService.getDownloadUrl(filePath),
    mimeType: FileUploadService.getMimeType(filePath)
  };
}
```

---

## 🎯 Resumo dos Benefícios

### ✅ **Antes vs Depois**

**Antes (sem tipagem rigorosa):**
```typescript
// ❌ Propenso a erros
const transaction = await api.get('/transactions/123');
console.log(transaction.ammount); // Typo não detectado
```

**Depois (com tipagem):**
```typescript
// ✅ Seguro e tipado
const transaction = await TransactionService.getTransactionById('123');
console.log(transaction.getFormattedAmount()); // Método sugerido pelo IDE
```

### 🛡️ **Proteções Implementadas**

1. **Validação em runtime** com type guards
2. **Erros detectados em tempo de compilação**
3. **IntelliSense aprimorado** no VS Code
4. **Refatoração segura** - mudanças propagam automaticamente
5. **Documentação viva** através dos tipos

### 🚀 **Próximos Passos**

1. Execute `npm run type-check` regularmente
2. Use os exemplos acima como referência
3. Explore os tipos disponíveis com Ctrl+Space no VS Code
4. Contribua com novos tipos conforme necessário

---

**💡 Dica:** Use Ctrl+Space no VS Code para ver todas as propriedades e métodos disponíveis em objetos tipados!
