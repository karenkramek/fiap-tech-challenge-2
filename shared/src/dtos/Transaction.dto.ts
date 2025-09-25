import { TransactionType } from '../types/TransactionType';

export interface TransactionDTO {
  id: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  date: string; // geralmente string (ISO) em APIs
  description?: string;
  attachmentPath?: string;
}
