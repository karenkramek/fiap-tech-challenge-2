import { TransactionType } from '../types/TransactionType';

export interface TransactionDTO {
  readonly id: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  date: string; // geralmente string (ISO) em APIs
  description?: string;
  attachmentPath?: string;
  goalId?: string;
}

export interface CreateTransactionDTO {
  type: TransactionType;
  amount: number;
  date: string;
  description?: string;
  attachmentPath?: string;
  goalId?: string;
}

export interface UpdateTransactionDTO {
  type?: TransactionType;
  amount?: number;
  date?: string;
  description?: string;
  attachmentPath?: string;
  goalId?: string;
}

// Type guards para validação em runtime
export function isTransactionDTO(obj: any): obj is TransactionDTO {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    obj.id.length > 0 &&
    Object.values(TransactionType).includes(obj.type) &&
    typeof obj.amount === 'number' &&
    obj.amount > 0 &&
    typeof obj.date === 'string' &&
    !isNaN(Date.parse(obj.date)) &&
    (obj.description === undefined || typeof obj.description === 'string') &&
    (obj.attachmentPath === undefined || typeof obj.attachmentPath === 'string') &&
    (obj.goalId === undefined || typeof obj.goalId === 'string')
  );
}

export function isCreateTransactionDTO(obj: any): obj is CreateTransactionDTO {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    Object.values(TransactionType).includes(obj.type) &&
    typeof obj.amount === 'number' &&
    obj.amount > 0 &&
    typeof obj.date === 'string' &&
    !isNaN(Date.parse(obj.date)) &&
    (obj.description === undefined || typeof obj.description === 'string') &&
    (obj.attachmentPath === undefined || typeof obj.attachmentPath === 'string') &&
    (obj.goalId === undefined || typeof obj.goalId === 'string')
  );
}
