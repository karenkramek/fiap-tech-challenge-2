// Declarações de tipos para módulos remotos do shared
// O remotes.d.ts é um "contrato" local para o TypeScript saber o que está disponível via Module Federation.
// Ele não é necessário em tempo de execução, só para o TypeScript.
// Sempre que adicionar algo novo ao shared e quiser consumir tipado, adicione a declaração correspondente no remotes.d.ts do consumidor.

// Por que preciso declarar tudo manualmente?
// Porque o TypeScript precisa saber a assinatura das funções, tipos e componentes que você vai consumir do shared.
// Não existe (ainda) uma integração automática entre o build do shared e o d.ts do consumidor, então é preciso manter esse arquivo atualizado manualmente.

// HOOKS

declare module 'shared/hooks/useTransactions' {
  import { Transaction, TransactionType } from 'shared/models/Transaction';
  export function useTransactions(): {
    transactions: Transaction[];
    loading: boolean;
    addTransaction: (
      type: TransactionType,
      amount: number,
      date: Date,
      description?: string,
      attachmentFile?: File
    ) => Promise<void>;
    updateTransaction: (
      id: string,
      type: TransactionType,
      amount: number,
      date: Date,
      description?: string,
      attachmentFile?: File
    ) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;
    fetchTransactions: () => Promise<void>;
  };
}

declare module 'shared/hooks/useAccount' {
  export function useAccount(): {
    account: { name: string; balance: number } | null;
    loading: boolean;
    currentUser: { id: string; name: string; email: string; isAuthenticated: boolean } | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<any>;
    logout: () => void;
    refreshAccount: () => Promise<void>;
  };
}

declare module 'shared/hooks/useModal' {
  export function useModal(initialOpen?: boolean): {
    open: boolean;
    openModal: () => void;
    closeModal: () => void;
    setOpen: (open: boolean) => void;
  };
}

declare module 'shared/hooks/useGroupedTransactions' {
  import { Transaction } from 'shared/models/Transaction';
  export function useGroupedTransactions(transactions: Transaction[]): {
    grouped: Record<string, Transaction[]>;
    sortedKeys: string[];
  };
}

// COMPONENTES

declare module 'shared/components/Button' {
  import { ButtonHTMLAttributes } from 'react';
  const Button: React.FC<ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string }>;
  export default Button;
}

declare module 'shared/components/Card' {
  const Card: React.FC<{ children: React.ReactNode; className?: string }>;
  export default Card;
}

declare module 'shared/components/TransactionBadge' {
  import { TransactionType } from 'shared/types/TransactionType';
  const TransactionBadge: React.FC<{ type: TransactionType }>;
  export default TransactionBadge;
}

declare module 'shared/components/ConfirmationModal' {
  interface Props {
    open: boolean;
    title: string;
    description: string;
    confirmText: string;
    cancelText: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
  }
  const ConfirmationModal: React.FC<Props>;
  export default ConfirmationModal;
}

declare module 'shared/components/EditTransactionModal' {
  interface Props {
    open: boolean;
    onClose: () => void;
    transactionId: string | null;
    onSuccess: () => void;
  }
  const EditTransactionModal: React.FC<Props>;
  export default EditTransactionModal;
}

declare module 'shared/components/StatementCard' {
  const StatementCard: React.FC;
  export default StatementCard;
}

declare module 'shared/components/BalanceCard' {
  const BalanceCard: React.FC<{ accountName?: string; balance?: number; showBalance?: boolean; onToggleBalance?: () => void }>;
  export default BalanceCard;
}

declare module 'shared/components/TransactionForm' {
  import { TransactionType } from 'shared/types/TransactionType';
  const TransactionForm: React.FC<{
    amount: string;
    transactionType: TransactionType;
    description: string;
    attachmentFile: File | null;
    onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFileSelect: (file: File | null) => void;
    onSubmit: (e: React.FormEvent) => void;
    loading?: boolean;
  }>;
  export default TransactionForm;
}

declare module 'shared/components/Icon' {
  import { TransactionType } from 'shared/types/TransactionType';
  export function TransactionTypeIcon({ type, className }: { type: TransactionType; className?: string }): JSX.Element;
  export const Edit: React.FC;
  export const Trash2: React.FC;
}

// MODELS & TYPES

declare module 'shared/models/Transaction' {
  export interface Transaction {
    id: string;
    type: any;
    amount: number;
    date: string | Date;
    description?: string;
    attachmentPath?: string;
    isIncome(): boolean;
    isExpense(): boolean;
  }
  export enum TransactionType {
    DEPOSIT = 'DEPOSIT',
    WITHDRAWAL = 'WITHDRAWAL',
    TRANSFER = 'TRANSFER',
    PAYMENT = 'PAYMENT'
  }
}

declare module 'shared/models/Account' {
  export class Account {
    id: string;
    name: string;
    balance: number;
  }
}

declare module 'shared/types/TransactionType' {
  export enum TransactionType {
    DEPOSIT = 'DEPOSIT',
    WITHDRAWAL = 'WITHDRAWAL',
    TRANSFER = 'TRANSFER',
    PAYMENT = 'PAYMENT'
  }
  export function getTransactionTypeLabel(type: TransactionType): string;
}

// UTILS

declare module 'shared/utils/utils' {
  export function formatDate(date: Date | string): string;
  export function formatDateForInput(date: Date): string;
  export function getMonthKey(date: Date): string;
  export function getMonthName(month: string | number): string;
  export function getCurrentDateFormatted(): string;
}

declare module 'shared/utils/currencyUtils' {
  export function formatCurrencyWithSymbol(value: number): string;
  export function formatCurrencyWithoutSymbol(value: number): string;
  export function createCurrencyInputHandler(setAmount: (value: string) => void): (e: React.ChangeEvent<HTMLInputElement>) => void;
  export function parseCurrencyStringToNumber(formattedValue: string): number;
  export function formatUserCurrencyInput(inputValue: string): string;
}

// SERVICES

declare module 'shared/services/AccountService' {
  export class AccountService {
    // ...métodos
  }
}

declare module 'shared/services/TransactionService' {
  export class TransactionService {
    // ...métodos
  }
}

declare module 'shared/services/api' {
  const api: any;
  export default api;
}

// DTOS

declare module 'shared/dtos/Transaction.dto' {
  export interface TransactionDTO {
    id: string;
    type: string;
    amount: number;
    date: string;
    description?: string;
  }
}

declare module 'shared/dtos/Account.dto' {
  export interface AccountDTO {
    id: string;
    name: string;
    balance: number;
  }
}
