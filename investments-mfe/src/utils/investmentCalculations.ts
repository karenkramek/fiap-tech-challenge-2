import type { InvestmentDTO } from 'shared/dtos/Investment.dto';
import { InvestmentType } from 'shared/types/InvestmentType';

export const sumByType = (investments: InvestmentDTO[], type: string) =>
  investments.filter(tx => tx.type === type).reduce((sum, tx) => sum + (tx.amount || 0), 0);

export const calculateInvestmentTotals = (allInvestments: InvestmentDTO[]) => {
  const funds = sumByType(allInvestments, InvestmentType.FUNDS);
  const treasury = sumByType(allInvestments, InvestmentType.TREASURY);
  const pension = sumByType(allInvestments, InvestmentType.PENSION);
  const stocks = sumByType(allInvestments, InvestmentType.STOCKS);

  return {
    funds,
    treasury,
    pension,
    stocks,
    fixedIncome: funds + treasury + pension,
    variableIncome: stocks,
    total: funds + treasury + pension + stocks
  };
};

export const calculateTransactionTotals = (transactions: any[], investments: any[] = [], goals: any[] = []) => {
  const sumTx = (type: string) => transactions.filter(tx => tx.type === type).reduce((sum, tx) => sum + (tx.amount || 0), 0);

  const inflows = sumTx('DEPOSIT');
  const outflows = sumTx('PAYMENT') + sumTx('TRANSFER') + sumTx('WITHDRAWAL') + sumTx('INVESTMENT') + sumTx('GOAL');
  const totalInvestments = investments.reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0);
  const totalGoals = goals.reduce((sum: number, goal: any) => sum + (goal.assigned || 0), 0);

  console.log(totalGoals);
  return {
    inflows,
    outflows,
    totalInvestments,
    totalGoals,
    deposits: sumTx('DEPOSIT'),
    withdrawals: sumTx('WITHDRAWAL'),
    transfers: sumTx('TRANSFER'),
    payments: sumTx('PAYMENT'),
    investments: sumTx('INVESTMENT'),
    goals: sumTx('GOAL'),
  };
};