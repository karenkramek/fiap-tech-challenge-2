import { TransactionType } from "../types/TransactionType";

export class Transaction {
  constructor(
    public id: string,
    public accountId: string,
    public type: TransactionType,
    public amount: number,
    public date: Date,
    public description?: string,
    public attachmentPath?: string
  ) {
    if (!id || !accountId || !type || isNaN(amount) || !(date instanceof Date)) {
      throw new Error('Dados inválidos para transação');
    }
  }

  static fromJSON(json: {
    id: string;
    accountId: string;
    type: TransactionType;
    amount: number;
    date: string;
    description?: string;
    attachmentPath?: string;
  }): Transaction {
    return new Transaction(
      json.id,
      json.accountId,
      json.type as TransactionType,
      json.amount,
      new Date(json.date),
      json.description,
      json.attachmentPath
    );
  }

  toJSON() {
    return {
      id: this.id,
      accountId: this.accountId,
      type: this.type,
      amount: this.amount,
      date: this.date.toISOString(),
      description: this.description,
      attachmentPath: this.attachmentPath
    };
  }

  isIncome(): boolean {
    return this.type === TransactionType.DEPOSIT;
  }

  isExpense(): boolean {
    return [TransactionType.WITHDRAWAL, TransactionType.TRANSFER, TransactionType.PAYMENT].includes(this.type);
  }
}
