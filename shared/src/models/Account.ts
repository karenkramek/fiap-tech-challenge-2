import { AccountDTO } from '../dtos/Account.dto';

export class Account {
  constructor(
    public readonly id: string,
    public name: string,
    public balance: number,
    public email?: string,
    public password?: string
  ) {
    this.validateAccount();
  }

  private validateAccount(): void {
    if (!this.id || this.id.trim().length === 0) {
      throw new Error('ID da conta é obrigatório');
    }
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Nome da conta é obrigatório');
    }
    if (typeof this.balance !== 'number' || isNaN(this.balance)) {
      throw new Error('Saldo deve ser um número válido');
    }
  }

  static fromJSON(json: {
    id: string;
    name: string;
    balance: number;
    email?: string;
    password?: string;
  }): Account {
    if (!json) {
      throw new Error('Dados da conta não fornecidos');
    }

    return new Account(
      json.id,
      json.name,
      json.balance,
      json.email,
      json.password
    );
  }

  toJSON(): AccountDTO {
    return {
      id: this.id,
      name: this.name,
      balance: this.balance
    };
  }

  updateBalance(amount: number): void {
    if (typeof amount !== 'number' || isNaN(amount)) {
      throw new Error('Valor deve ser um número válido');
    }
    this.balance = amount;
  }

  addBalance(amount: number): void {
    if (typeof amount !== 'number' || isNaN(amount)) {
      throw new Error('Valor deve ser um número válido');
    }
    this.balance += amount;
  }

  subtractBalance(amount: number): void {
    if (typeof amount !== 'number' || isNaN(amount)) {
      throw new Error('Valor deve ser um número válido');
    }
    this.balance -= amount;
  }

  hasInsufficientFunds(amount: number): boolean {
    return this.balance < amount;
  }
}
