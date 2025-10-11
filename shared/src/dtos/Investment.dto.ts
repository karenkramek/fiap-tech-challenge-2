import type { InvestmentType, RiskLevel } from '../types/InvestmentType';

export interface InvestmentDTO {
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
}

export interface InvestmentGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  description?: string;
  category: 'APOSENTADORIA' | 'CASA' | 'VIAGEM' | 'EMERGENCIA' | 'OUTROS';
}

export interface PortfolioSummary {
  totalInvested: number;
  totalReturn: number;
  monthlyReturn: number;
  riskDistribution: {
    baixo: number;
    medio: number;
    alto: number;
  };
}