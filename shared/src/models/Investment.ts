import type { InvestmentDTO } from "../dtos/Investment.dto";
import { InvestmentType, RiskLevel } from "../types/InvestmentType";

export class Investment implements InvestmentDTO {
  id: string;
  accountId: string;
  type: InvestmentType;
  amount: number;
  date: string;
  description: string | undefined;
  goalId: string | undefined;
  redeemed: boolean | undefined;
  expectedReturn: number | undefined;
  riskLevel: RiskLevel | undefined;

  constructor(
    id: string,
    accountId: string,
    type: InvestmentType,
    amount: number,
    date: string,
    description?: string,
    goalId?: string,
    redeemed?: boolean,
    expectedReturn?: number,
    riskLevel?: RiskLevel
  ) {
    this.id = id;
    this.accountId = accountId;
    this.type = type;
    this.amount = amount;
    this.date = date;
    this.description = description;
    this.goalId = goalId;
    this.redeemed = redeemed;
    this.expectedReturn = expectedReturn;
    this.riskLevel = riskLevel;
    this.validateInvestment();
  }

  private validateInvestment(): void {
    if (!this.id || this.id.trim().length === 0) {
      throw new Error('ID do investimento é obrigatório');
    }
    if (!this.accountId || this.accountId.trim().length === 0) {
      throw new Error('Conta do investimento é obrigatória');
    }
    if (!this.type) {
      throw new Error('Tipo de investimento é obrigatório');
    }
    if (typeof this.amount !== 'number' || isNaN(this.amount) || this.amount <= 0) {
      throw new Error('Valor deve ser um número positivo');
    }
    if (!this.date || typeof this.date !== 'string') {
      throw new Error('Data do investimento é obrigatória');
    }
  }

  static fromJSON(json: InvestmentDTO): Investment {
    if (!json) {
      throw new Error('Dados do investimento não fornecidos');
    }
    return new Investment(
      json.id,
      json.accountId,
      json.type,
      json.amount,
      json.date,
      json.description,
      json.goalId,
      json.redeemed,
      json.expectedReturn,
      json.riskLevel
    );
  }

  toJSON(): InvestmentDTO {
    return {
      id: this.id,
      accountId: this.accountId,
      type: this.type,
      amount: this.amount,
      date: this.date,
      description: this.description,
      goalId: this.goalId,
      redeemed: this.redeemed,
      expectedReturn: this.expectedReturn,
      riskLevel: this.riskLevel
    };
  }

  isRedeemed(): boolean {
    return !!this.redeemed;
  }

  getFormattedAmount(): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.amount);
  }

  getFormattedDate(): string {
    return new Date(this.date).toLocaleDateString('pt-BR');
  }
}
