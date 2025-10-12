export enum InvestmentType {
  FUNDS = 'FUNDS',
  TREASURY = 'TREASURY',
  PENSION = 'PENSION',
  STOCKS = 'STOCKS'
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export const INVESTMENT_TYPE_LABELS: Record<InvestmentType, string> = {
  [InvestmentType.FUNDS]: 'Fundos de Investimento',
  [InvestmentType.TREASURY]: 'Tesouro Direto',
  [InvestmentType.PENSION]: 'Previdência Privada',
  [InvestmentType.STOCKS]: 'Bolsa de Valores'
};

export const INVESTMENT_TYPE_FILENAME: Record<InvestmentType, string> = {
  [InvestmentType.FUNDS]: 'fundos',
  [InvestmentType.TREASURY]: 'tesouro',
  [InvestmentType.PENSION]: 'previdencia',
  [InvestmentType.STOCKS]: 'acoes'
};

export const getInvestmentTypeLabel = (type: InvestmentType): string => INVESTMENT_TYPE_LABELS[type];