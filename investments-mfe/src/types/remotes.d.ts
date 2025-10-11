// Tipos dos módulos remotos do shared para uso com Module Federation no investments-mfe.
// Mantenha este arquivo atualizado para garantir tipagem ao importar do shared.
// Só é necessário para o TypeScript (não afeta o runtime).

// HOOKS
declare module 'shared/hooks/useTransactions';
declare module 'shared/hooks/useAccount';
declare module 'shared/hooks/useModal';
declare module 'shared/hooks/useGroupedTransactions';
declare module 'shared/hooks/useAuthProtection';

// COMPONENTS
declare module 'shared/components/ui/Button';
declare module 'shared/components/ui/Card';
declare module 'shared/components/ui/Icon';
declare module 'shared/components/ui/ConfirmationModal' {
  import * as React from 'react';
  interface ConfirmationModalProps {
    open: boolean;
    title: string;
    description: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showCancelButton?: boolean;
    confirmVariant?: 'danger' | 'warning' | 'success';
  }
  const ConfirmationModal: React.FC<ConfirmationModalProps>;
  export default ConfirmationModal;
}
declare module 'shared/components/ui/LoadingSpinner';
declare module 'shared/components/ui/FeedbackProvider';
declare module 'shared/components/ui/ModalWrapper';
declare module 'shared/components/domain/transaction/TransactionAdd';
declare module 'shared/components/domain/transaction/TransactionTypeBadge';
declare module 'shared/components/domain/transaction/TransactionList';
declare module 'shared/components/domain/transaction/TransactionEdit';
declare module 'shared/components/domain/file/AttachmentDisplay';
declare module 'shared/components/domain/file/FilePreviewModal';
declare module 'shared/components/domain/file/FileUpload';
declare module 'shared/components/domain/BalanceCard';
declare module 'shared/components/ui/ErrorBoundary';
declare module 'shared/components/ui/ModalCloseButton';
declare module 'shared/components/ui/BadgeSuggestions' {
  interface BadgeSuggestionsProps {
    suggestions: string[];
    onSelect: (value: string) => void;
  }
  const BadgeSuggestions: React.FC<BadgeSuggestionsProps>;
  export default BadgeSuggestions;
}

// MODELS
declare module 'shared/models/Transaction' {
  export class Transaction {
    readonly id: string;
    accountId: string;
    type: import('shared/types/TransactionType').TransactionType;
    amount: number;
    date: Date;
    description?: string;
    attachmentPath?: string;
    goalId?: string;
    constructor(
      id: string,
      accountId: string,
      type: import('shared/types/TransactionType').TransactionType,
      amount: number,
      date: Date,
      description?: string,
      attachmentPath?: string,
      goalId?: string
    );
    // Métodos públicos
    getFormattedDate(): string;
    hasAttachment(): boolean;
    // ...adicione outros métodos se necessário
  }
}

declare module 'shared/models/Account' {
  export class Account {
    constructor(
      id: string,
      name: string,
      balance: number,
      email?: string,
      password?: string
    );
    // Métodos e propriedades relevantes podem ser adicionados aqui
  }
}

declare module 'shared/models/Investment' {
  import type { InvestmentDTO } from 'shared/dtos/Investment.dto';
  import type { InvestmentType, RiskLevel } from 'shared/types/InvestmentType';
  export class Investment implements InvestmentDTO {
    id: string;
    accountId: string;
    type: InvestmentType;
    amount: number;
    date: string;
    description?: string;
    goalId?: string;
    redeemed?: boolean;
    expectedReturn?: number;
    riskLevel?: RiskLevel;
    constructor(
      id: string,
      accountId: string,
      type: InvestmentType,
      amount: number,
      date: string,
      description?: string,
      goalId?: string,
      redeemed?: boolean,
      expectedReturn?: number,
      riskLevel?: RiskLevel
    );
    static fromJSON(json: InvestmentDTO): Investment;
    toJSON(): InvestmentDTO;
    isRedeemed(): boolean;
    getFormattedAmount(): string;
    getFormattedDate(): string;
  }
}

// TYPES
declare module 'shared/types/TransactionType';
declare module 'shared/types/InvestmentType';

// UTILS

declare module 'shared/utils/date' {
  export function formatDate(date: Date | string): string;
  export function formatDateForInput(date: Date): string;
  export function getMonthKey(date: Date): string;
  export function getMonthName(month: string | number): string;
  export function getCurrentDateFormatted(): string;
}

declare module 'shared/utils/currency' {
  export function formatCurrencyWithSymbol(value: number): string;
  export function formatCurrencyWithoutSymbol(value: number): string;
  export function createCurrencyInputHandler(setAmount: (value: string) => void): (e: React.ChangeEvent<HTMLInputElement>) => void;
  export function parseCurrencyStringToNumber(formattedValue: string): number;
  export function formatUserCurrencyInput(inputValue: string): string;
}

// SERVICES
declare module 'shared/services/AccountService';
declare module 'shared/services/TransactionService';
declare module 'shared/services/api';
declare module 'shared/services/InvestmentService' {
  import type { InvestmentDTO } from 'shared/dtos/Investment.dto';
  import type { AccountDTO } from 'shared/dtos/Account.dto';
  export const InvestmentService: {
    getAll(accountId: string): Promise<InvestmentDTO[]>;
    getById(id: string): Promise<InvestmentDTO | null>;
    create(investment: InvestmentDTO): Promise<InvestmentDTO>;
    update(id: string, data: Partial<InvestmentDTO>): Promise<InvestmentDTO>;
    remove(id: string): Promise<void>;
    getAccountById(accountId: string): Promise<AccountDTO | null>;
    updateAccountBalance(accountId: string, newBalance: number): Promise<AccountDTO>;
  };
}

declare module 'shared/services/GoalService' {
  export interface GoalDTO {
    id: string;
    accountId: string;
    name: string;
    value: number;
    assigned: number;
    createdAt: string;
    deadline?: string;
  }
  export const GoalService: {
    getAll(accountId: string): Promise<GoalDTO[]>;
    getById(id: string): Promise<GoalDTO | null>;
    update(id: string, data: Partial<GoalDTO>): Promise<GoalDTO>;
    delete(id: string): Promise<void>;
    create(goal: GoalDTO): Promise<GoalDTO>;
  };
}

// DTOS
declare module 'shared/dtos/Transaction.dto';
declare module 'shared/dtos/Account.dto';
declare module 'shared/dtos/Investment.dto' {
  import type { InvestmentType, RiskLevel } from 'shared/types/InvestmentType';
  export interface InvestmentDTO {
    id: string;
    accountId: string;
    type: InvestmentType;
    amount: number;
    date: string;
    description: string | undefined;
    goalId: string | undefined;
    redeemed: boolean | undefined;
    expectedReturn: number | undefined;
    riskLevel: RiskLevel | undefined;
  }
  export interface InvestmentGoal {
    id: string;
    title: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
    description?: string;
    category: 'APOSENTADORIA' | 'CASA' | 'VIAGEM' | 'EMERGENCIA' | 'OUTROS';
  }
  export interface PortfolioSummary {
    totalInvested: number;
    totalReturn: number;
    monthlyReturn: number;
    riskDistribution: {
      baixo: number;
      medio: number;
      alto: number;
    };
  }
}

declare module 'shared/store' {
  import { Store } from 'redux';
  import { ThunkDispatch } from '@reduxjs/toolkit';
  export type RootState = ReturnType<Store['getState']>;
  export type AppDispatch = ThunkDispatch<RootState, any, any>;
  const store: Store;
  export default store;
}
