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
type TransactionForm = {
  amount: number;
  type: TransactionType;
  date: Date;
  description?: string;
};

const transactionData: TransactionForm = {
  amount: 150.50,
  type: TransactionType.DEPOSIT,
  date: new Date(),
  description: 'Depósito salário'
};

// Validação tipada
const { isValid, errors } = validateObject(transactionData, ValidationSchemas.transaction);

if (!isValid) {
  console.log('Erros encontrados:', errors);
} else {
  console.log('Dados válidos!');
}
```

### ✅ Validação de conta

```typescript
import { validateObject, ValidationSchemas } from 'shared/utils/validation';

const accountData = {
  name: 'Conta Corrente',
  balance: 1000.00
};

const validation = validateObject(accountData, ValidationSchemas.account);

if (validation.isValid) {
  // Criar conta
} else {
  Object.entries(validation.errors).forEach(([field, error]) => {
    console.log(`${field}: ${error}`);
  });
}
```

### ✅ Validações personalizadas

```typescript
import { ValidationUtils } from 'shared/utils/validation';

const email = 'usuario@exemplo.com';
if (ValidationUtils.isEmail(email)) {
  console.log('Email válido');
}

const amount = 999.99;
if (ValidationUtils.isValidAmount(amount)) {
  console.log('Valor válido para transação');
}

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
import { Transaction } from 'shared/models/Transaction';

async function fetchData() {
  const response = await fetch('/api/transactions/123');
  const data = await response.json();

  if (isTransactionDTO(data)) {
    // data: TransactionDTO
    const transaction = Transaction.fromJSON(data);
    console.log(transaction.getFormattedAmount());
  } else {
    console.error('Dados inválidos recebidos da API');
  }
}
```

### ✅ Validando dados de localStorage

```typescript
import { isTransactionDTO } from 'shared/dtos/Transaction.dto';

function loadFromStorage() {
  const stored = localStorage.getItem('lastTransaction');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.date) parsed.date = new Date(parsed.date);
      if (isTransactionDTO(parsed)) {
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

async function loadTransactions() {
  const transactions = await TransactionService.getAllTransactions();
  transactions.forEach(t => {
    console.log(t.getFormattedAmount());
  });
}

async function loadFilteredTransactions() {
  const filters: TransactionFilters = {
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    type: TransactionType.DEPOSIT,
    minAmount: 100,
    page: 1,
    limit: 10
  };
  return TransactionService.getAllTransactions(filters);
}

async function createTransaction() {
  try {
    const newTransaction = await TransactionService.addTransaction(
      TransactionType.DEPOSIT,
      500.00,
      new Date(),
      'Depósito PIX'
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
```

### ✅ Usando AccountService

```typescript
import { AccountService } from 'shared/services/AccountService';
import { CreateAccountDTO } from 'shared/dtos/Account.dto';

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

async function createNewAccount() {
  const accountData: CreateAccountDTO = {
    name: 'Minha Conta Poupança'
  };
  return AccountService.createAccount(accountData);
}
```

### ✅ Upload de arquivos tipado

```typescript
import { FileUploadService } from 'shared/services/FileUploadService';
import { TransactionType } from 'shared/types/TransactionType';

async function handleFileUpload(file: File, transactionType: TransactionType) {
  const validation = FileUploadService.validateFile(file);
  if (!validation.isValid) {
    alert(validation.error);
    return;
  }
  try {
    const filePath = await FileUploadService.uploadFile(file, transactionType);
    const downloadUrl = FileUploadService.getDownloadUrl(filePath);
    const displayName = FileUploadService.getFileName(filePath, transactionType);
    return filePath;
  } catch (error) {
    console.error('Erro no upload:', error);
    throw error;
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

function createTransaction() {
  const transaction = new Transaction(
    'tx-001',
    TransactionType.WITHDRAWAL,
    150.00,
    new Date(),
    'Saque ATM'
  );
  console.log(transaction.getFormattedAmount());
  return transaction;
}

function manageAccount() {
  const account = new Account('acc-001', 'Conta Corrente', 1000.00);
  account.addBalance(500.00);
  account.subtractBalance(200.00);
  if (account.hasInsufficientFunds(1500.00)) {
    console.log('Saldo insuficiente');
  }
  const dto = account.toJSON();
  console.log('DTO:', dto);
}
```

### ✅ Usando interfaces centralizadas

```typescript
import { ITransaction, ICreateTransaction } from 'shared/types/transaction.types';
import { TransactionType } from 'shared/types/TransactionType';

const createData: ICreateTransaction = {
  type: TransactionType.TRANSFER,
  amount: 300.00,
  date: new Date(),
  description: 'Transferência para poupança'
};

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
    deleteTransaction
  } = useTransactions();

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
      console.error('Erro:', error instanceof Error ? error.message : error);
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

  if (loading) return <div>Carregando conta...</div>;
  if (error) return <div>Erro: {error.message}</div>;
  if (!account) return <div>Conta não encontrada</div>;

  return (
    <div>
      <h2>{account.name}</h2>
      <p>Saldo: R$ {account.balance.toFixed(2)}</p>
      <button onClick={refreshAccount}>Atualizar</button>
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
  const handleEdit = () => {
    onEdit?.(transaction.id);
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
      {transaction.description && <p>{transaction.description}</p>}
      {transaction.hasAttachment() && <span>📎 Anexo</span>}
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
  const [errors, setErrors] = useState<Partial<Record<keyof TransactionFormData, string>>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateObject(formData, ValidationSchemas.transaction);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
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
import { TransactionType } from 'shared/types/TransactionType';

async function handleTransactionCreation() {
  try {
    await TransactionService.addTransaction(
      TransactionType.DEPOSIT,
      -100,
      new Date()
    );
  } catch (error) {
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
import { TransactionType } from 'shared/types/TransactionType';

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
      if (error instanceof Error) {
        setOperationError(error.message);
      } else {
        setOperationError('Erro desconhecido');
      }
    }
  };

  return (
    <div>
      <button onClick={handleAddTransaction}>Adicionar Transação</button>
      {operationError && (
        <div className="error-message">Erro: {operationError}</div>
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

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
}

function getTransactionSummary(transactions: Transaction[]) {
  return {
    total: transactions.length,
    income: transactions.filter(t => t.isIncome()).length,
    expenses: transactions.filter(t => t.isExpense()).length,
    totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
    withAttachments: transactions.filter(t => t.hasAttachment()).length
  };
}

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

- Tipos e utilitários centralizados em `shared/types` e `shared/utils`.
- Imports de tipos e helpers sempre do `shared`.
- Menos duplicidade e conflitos de tipos entre MFEs.
- Ambiente de build e testes mais estável.
- Refatoração e manutenção facilitadas.

**💡 Dica:** Use Ctrl+Space no VS Code para explorar os tipos disponíveis!
