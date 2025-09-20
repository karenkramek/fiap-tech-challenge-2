export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER = 'TRANSFER',
  PAYMENT = 'PAYMENT'
}

export const getTransactionTypeLabel = (type: TransactionType): string => {
  const labels: Record<TransactionType, string> = {
    [TransactionType.DEPOSIT]: 'Depósito',
    [TransactionType.WITHDRAWAL]: 'Saque',
    [TransactionType.TRANSFER]: 'Transferência',
    [TransactionType.PAYMENT]: 'Pagamento'
  };
  return labels[type];
};