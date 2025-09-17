// Declarações de tipos para módulos remotos do shared

declare module 'shared/hooks/useTransactions' {
  import { Transaction, TransactionType } from 'shared/models/Transaction';
  export function useTransactions(): {
    transactions: Transaction[];
    loading: boolean;
    addTransaction: (
      type: TransactionType,
      amount: number,
      date: Date,
      description: string
    ) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;
    fetchTransactions: () => Promise<void>;
  };
}

declare module 'shared/hooks/useAccount' {
  export function useAccount(): {
    account: { name: string; balance: number } | null;
    loading: boolean;
    refreshAccount: () => Promise<void>;
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
  export enum TransactionType {
    DEPOSIT = 'DEPOSIT',
    WITHDRAWAL = 'WITHDRAWAL',
    TRANSFER = 'TRANSFER',
    PAYMENT = 'PAYMENT'
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
  export function getMonthKey(date: Date): string;
  export function getMonthName(month: string | number): string;
}
