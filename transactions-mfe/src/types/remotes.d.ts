declare module 'shared/components/Card' {
  import { FC, PropsWithChildren } from 'react';
  const Card: FC<PropsWithChildren<any> & { className?: string }>;
  export default Card;
}
declare module 'shared/components/Button' {
  import { FC, ButtonHTMLAttributes } from 'react';
  const Button: FC<ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string }>;
  export default Button;
}
declare module 'shared/components/TransactionBadge' {
  import { FC } from 'react';
  import { TransactionType } from 'shared/types/TransactionType';
  const TransactionBadge: FC<{ type: TransactionType }>;
  export default TransactionBadge;
}
declare module 'shared/types/TransactionType' {
  export enum TransactionType {
    DEPOSIT = 'DEPOSIT',
    WITHDRAWAL = 'WITHDRAWAL',
    TRANSFER = 'TRANSFER',
    PAYMENT = 'PAYMENT'
  }
}
declare module 'shared/hooks/useTransactions' {
  import { Transaction } from 'shared/models/Transaction';
  import { TransactionType } from 'shared/types/TransactionType';
  export function useTransactions(): {
    transactions: Transaction[];
    loading: boolean;
    error: Error | null;
    fetchTransactions: () => Promise<void>;
    addTransaction: (
      type: TransactionType,
      amount: number,
      date: Date,
      description?: string
    ) => Promise<Transaction>;
    updateTransaction: (
      id: string,
      type: TransactionType,
      amount: number,
      date: Date,
      description?: string
    ) => Promise<Transaction>;
    deleteTransaction: (id: string) => Promise<boolean>;
  };
}
declare module 'shared/models/Transaction' {
  export interface Transaction {
    id: string;
    type: any;
    amount: number;
    date: string | Date;
    description?: string;
    isIncome(): boolean;
    isExpense(): boolean;
  }
}
declare module 'shared/utils/currencyUtils' {
  export function formatCurrencyWithSymbol(value: number): string;
  export function formatCurrencyWithoutSymbol(value: number): string;
  export function createCurrencyInputHandler(setAmount: (value: string) => void): (e: React.ChangeEvent<HTMLInputElement>) => void;
  export function parseCurrencyStringToNumber(formattedValue: string): number;
}
declare module 'shared/utils/utils' {
  export function formatDate(date: Date | string): string;
  export function formatDateForInput(date: Date): string;
  export function getMonthName(month: string | number): string;
}
declare module 'shared/components/ConfirmationModal' {
  import { FC } from 'react';
  const ConfirmationModal: FC<any>;
  export default ConfirmationModal;
}
declare module 'shared/hooks/useModal' {
  export function useModal(initialOpen?: boolean): any;
}
declare module 'shared/services/TransactionService' {
  export class TransactionService {
    static getTransactionById(id: string): Promise<any>;
    // Adicione outros métodos se desejar
  }
}
declare module 'shared/hooks/useGroupedTransactions' {
  import { Transaction } from 'shared/models/Transaction';
  export function useGroupedTransactions(transactions: Transaction[]): { grouped: Record<string, Transaction[]>; sortedKeys: string[] };
}
declare module 'shared/dtos/Transaction.dto' {
  export interface TransactionDTO {
    id: string;
    type: string;
    amount: number;
    date: string;
    description?: string;
  }
}

declare module 'shared/models/Account' {
  export interface Account {
    id: string;
    name: string;
    balance: number;
  }
}
