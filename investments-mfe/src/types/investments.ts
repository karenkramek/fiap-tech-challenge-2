export interface Investment {
  id: string;
  type: 'FUNDOS' | 'TESOURO' | 'PREVIDENCIA' | 'ACOES' | 'CDB';
  amount: number;
  description: string;
  date: string;
  expectedReturn?: number;
  riskLevel?: 'BAIXO' | 'MEDIO' | 'ALTO';
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