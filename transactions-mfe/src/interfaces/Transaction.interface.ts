import { TransactionType } from '../../../shared/src/types/TransactionType';

export interface ITransaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: Date;
  description?: string;
}