export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER = 'TRANSFER',
  PAYMENT = 'PAYMENT',
  INVESTMENT = 'INVESTMENT',
  GOAL = 'GOAL'
}

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  [TransactionType.DEPOSIT]: 'Depósito',
  [TransactionType.WITHDRAWAL]: 'Saque',
  [TransactionType.TRANSFER]: 'Transferência',
  [TransactionType.PAYMENT]: 'Pagamento',
  [TransactionType.INVESTMENT]: 'Investimento',
  [TransactionType.GOAL]: 'Meta'
};

export const TRANSACTION_TYPE_FILENAME: Record<TransactionType, string> = {
  [TransactionType.DEPOSIT]: 'deposito',
  [TransactionType.WITHDRAWAL]: 'saque',
  [TransactionType.TRANSFER]: 'transferencia',
  [TransactionType.PAYMENT]: 'pagamento',
  [TransactionType.INVESTMENT]: 'investimento',
  [TransactionType.GOAL]: 'meta'
};

export const getTransactionTypeLabel = (type: TransactionType): string => TRANSACTION_TYPE_LABELS[type];