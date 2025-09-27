// Tipos dos módulos remotos do shared para uso com Module Federation.
// Mantenha este arquivo atualizado para garantir tipagem ao importar do shared.
// Só é necessário para o TypeScript (não afeta o runtime).

// HOOKS

declare module 'shared/hooks/useTransactions' {
  import { Transaction, TransactionType } from 'shared/models/Transaction';
  export function useTransactions(): {
    transactions: Transaction[];
    loading: boolean;
    error: Error | null;
    fetchTransactions: () => Promise<void>;
    addTransaction: (
      type: TransactionType,
      amount: number,
      date: Date,
      description?: string,
      attachmentFile?: File
    ) => Promise<Transaction>;
    updateTransaction: (
      id: string,
      type: TransactionType,
      amount: number,
      date: Date,
      description?: string,
      attachmentFile?: File
    ) => Promise<Transaction>;
    deleteTransaction: (id: string) => Promise<boolean>;
  };
}

declare module 'shared/hooks/useAccount' {
  import { Account } from 'shared/models/Account';
  export function useAccount(): {
    account: Account | null;
    loading: boolean;
    error: Error | null;
    fetchAccount: () => Promise<void>;
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

declare module 'shared/components/ui/Button' {
  import { ButtonHTMLAttributes } from 'react';
  const Button: React.FC<ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string }>;
  export default Button;
}

declare module 'shared/components/ui/Card' {
  const Card: React.FC<{ children: React.ReactNode; className?: string }>;
  export default Card;
}

declare module 'shared/components/ui/Icon' {
  import { TransactionType } from 'shared/types/TransactionType';
  export function TransactionTypeIcon({ type, className }: { type: TransactionType; className?: string }): JSX.Element;
  export const Edit: React.FC;
  export const Trash2: React.FC;
}

declare module 'shared/components/ui/ConfirmationModal' {
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

declare module 'shared/components/ui/ModalWrapper' {
  interface ModalWrapperProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
  }
  const ModalWrapper: React.FC<ModalWrapperProps>;
  export default ModalWrapper;
}

declare module 'shared/components/domain/transaction/TransactionAdd' {
  import { TransactionType } from 'shared/types/TransactionType';
  const TransactionAdd: React.FC<{
    amount: string;
    transactionType: TransactionType;
    description: string;
    attachmentFile: File | null;
    onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFileSelect: (file: File | null) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClose?: () => void;
    loading?: boolean;
  }>;
  export default TransactionAdd;
}

declare module 'shared/components/domain/transaction/TransactionTypeBadge' {
  import { TransactionType } from 'shared/types/TransactionType';
  const TransactionTypeBadge: React.FC<{ type: TransactionType }>;
  export default TransactionTypeBadge;
}

declare module 'shared/components/domain/transaction/TransactionList' {
  import { Transaction } from 'shared/models/Transaction';
  export interface TransactionListProps {
    transactions?: Transaction[];
    onTransactionsChanged?: () => void;
    mode?: 'dashboard' | 'full';
  }
  const TransactionList: React.FC<TransactionListProps>;
  export default TransactionList;
}

declare module 'shared/components/domain/transaction/TransactionEdit' {
  interface Props {
    onClose: () => void;
    transactionId: string | null;
    onSuccess?: () => void;
  }
  const TransactionEdit: React.FC<Props>;
  export default TransactionEdit;
}

declare module 'shared/components/domain/file/AttachmentDisplay' {
  const AttachmentDisplay: React.FC<{
    attachmentPath: string;
    className?: string;
    showLabel?: boolean;
    showPreviewButton?: boolean;
  }>;
  export default AttachmentDisplay;
}

declare module 'shared/components/domain/file/FilePreviewModal' {
  const FilePreviewModal: React.FC<{
    open: boolean;
    onClose: () => void;
    attachmentPath: string;
  }>;
  export default FilePreviewModal;
}

declare module 'shared/components/domain/file/FileUpload' {
  const FileUpload: React.FC<{
    onFileSelect: (file: File | null) => void;
    selectedFile?: File | null;
    existingFilePath?: string;
    disabled?: boolean;
  }>;
  export default FileUpload;
}

declare module 'shared/components/domain/BalanceCard' {
  const BalanceCard: React.FC<{ accountName?: string; balance?: number; showBalance?: boolean; onToggleBalance?: () => void }>;
  export default BalanceCard;
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

declare module 'shared/components/ui/FeedbackProvider' {
  const FeedbackProvider: React.ComponentType;
  export default FeedbackProvider;
}
declare module 'shared/components/ui/ErrorBoundary' {
  import { ReactNode } from 'react';
  const ErrorBoundary: React.ComponentType<{ children: ReactNode; fallback?: ReactNode }>;
  export default ErrorBoundary;
}
declare module 'shared/components/ui/LoadingSpinner' {
  const LoadingSpinner: React.ComponentType<{ size?: number }>;
  export default LoadingSpinner;
}
