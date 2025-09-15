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

export class Transaction {
  constructor(
    public id: string,
    public type: TransactionType,
    public amount: number,
    public date: Date,
    public description?: string
  ) {
    if (!id || !type || isNaN(amount) || !(date instanceof Date)) {
      throw new Error('Dados inválidos para transação');
    }
  }

  static fromJSON(json: {
    id: string;
    type: TransactionType;
    amount: number;
    date: string;
    description?: string;
  }): Transaction {
    return new Transaction(
      json.id,
      json.type as TransactionType,
      json.amount,
      new Date(json.date),
      json.description
    );
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      amount: this.amount,
      date: this.date.toISOString(),
      description: this.description
    };
  }

  isIncome(): boolean {
    return this.type === TransactionType.DEPOSIT;
  }

  isExpense(): boolean {
    return [TransactionType.WITHDRAWAL, TransactionType.TRANSFER, TransactionType.PAYMENT].includes(this.type);
  }
}
