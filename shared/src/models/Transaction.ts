import { TransactionType } from "../types/TransactionType";
import { TransactionDTO } from '../dtos/Transaction.dto';

export class Transaction {
  constructor(
    public readonly id: string,
    public accountId: string,
    public type: TransactionType,
    public amount: number,
    public date: Date,
    public description?: string,
    public attachmentPath?: string,
    public goalId?: string,
    public investmentId?: string
  ) {
    this.validateTransaction();
  }

  private validateTransaction(): void {
    if (!this.id || this.id.trim().length === 0) {
      throw new Error('ID da transação é obrigatório');
    }

    if (!Object.values(TransactionType).includes(this.type)) {
      throw new Error('Tipo de transação inválido');
    }

    if (typeof this.amount !== 'number' || isNaN(this.amount) || this.amount <= 0) {
      throw new Error('Valor deve ser um número positivo');
    }

    if (!(this.date instanceof Date) || isNaN(this.date.getTime())) {
      throw new Error('Data deve ser válida');
    }

    if (this.description !== undefined && typeof this.description !== 'string') {
      throw new Error('Descrição deve ser uma string');
    }

    if (this.attachmentPath !== undefined && typeof this.attachmentPath !== 'string') {
      throw new Error('Caminho do anexo deve ser uma string');
    }

    if (this.goalId !== undefined && typeof this.goalId !== 'string') {
      throw new Error('goalId deve ser uma string');
    }
    if (this.investmentId !== undefined && typeof this.investmentId !== 'string') {
      throw new Error('investmentId deve ser uma string');
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
    goalId?: string;
    investmentId?: string;
  }): Transaction {
    if (!json) {
      throw new Error('Dados da transação não fornecidos');
    }

    return new Transaction(
      json.id,
      json.accountId,
      json.type as TransactionType,
      json.amount,
      new Date(json.date),
      json.description,
      json.attachmentPath,
      json.goalId,
      json.investmentId
    );
  }

  toJSON(): TransactionDTO {
    const result: TransactionDTO = {
      id: this.id,
      accountId: this.accountId,
      type: this.type,
      amount: this.amount,
      date: this.date.toISOString()
    };

    if (this.description !== undefined) {
      result.description = this.description;
    }

    if (this.attachmentPath !== undefined) {
      result.attachmentPath = this.attachmentPath;
    }

    if (this.goalId !== undefined) {
      result.goalId = this.goalId;
    }
    if (this.investmentId !== undefined) {
      result.investmentId = this.investmentId;
    }

    return result;
  }

  isIncome(): boolean {
    return this.type === TransactionType.DEPOSIT;
  }

  isExpense(): boolean {
    return [
      TransactionType.WITHDRAWAL,
      TransactionType.TRANSFER,
      TransactionType.PAYMENT,
      TransactionType.INVESTMENT
    ].includes(this.type);
  }

  isSameDay(other: Transaction): boolean {
    return this.date.toDateString() === other.date.toDateString();
  }

  isSameMonth(other: Transaction): boolean {
    return (
      this.date.getFullYear() === other.date.getFullYear() &&
      this.date.getMonth() === other.date.getMonth()
    );
  }

  getFormattedAmount(): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.amount);
  }

  getFormattedDate(): string {
    return this.date.toLocaleDateString('pt-BR');
  }

  hasAttachment(): boolean {
    return this.attachmentPath !== undefined && this.attachmentPath.length > 0;
  }
}
