import { TransactionType } from 'shared/types/TransactionType';

export interface ITransaction {
  readonly id: string;
  type: TransactionType;
  amount: number;
  date: Date;
  description?: string;
  attachmentPath?: string;
  goalId?: string;
  investmentId?: string;
}

export interface ICreateTransaction {
  type: TransactionType;
  amount: number;
  date: Date;
  description?: string;
  attachmentPath?: string;
  goalId?: string;
  investmentId?: string;
}

export interface IUpdateTransaction {
  type?: TransactionType;
  amount?: number;
  date?: Date;
  description?: string;
  attachmentPath?: string;
  goalId?: string;
  investmentId?: string;
}

// Type guard para validação em runtime
export function isITransaction(obj: any): obj is ITransaction {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    obj.id.length > 0 &&
    Object.values(TransactionType).includes(obj.type) &&
    typeof obj.amount === 'number' &&
    obj.amount > 0 &&
    obj.date instanceof Date &&
    !isNaN(obj.date.getTime()) &&
    (obj.description === undefined || typeof obj.description === 'string') &&
    (obj.attachmentPath === undefined || typeof obj.attachmentPath === 'string') &&
    (obj.goalId === undefined || typeof obj.goalId === 'string') &&
    (obj.investmentId === undefined || typeof obj.investmentId === 'string')
  );
}
