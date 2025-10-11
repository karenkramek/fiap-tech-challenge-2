import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useInvestments } from '../../hooks/useInvestments';
import { calculateTransactionTotals } from '../../utils/investmentCalculations';
import { createTransferBarData, transferBarOptions } from '../../config/chartConfigs';

const TransactionsAnalysisCard: React.FC = () => {
  const { transactions } = useInvestments();
  const transactionTotals = calculateTransactionTotals(transactions);
  const transferBarData = createTransferBarData({
    DEPOSIT: transactionTotals.deposits,
    PAYMENT: transactionTotals.payments,
    TRANSFER: transactionTotals.transfers,
    WITHDRAWAL: transactionTotals.withdrawals,
    INVESTMENT: transactionTotals.investments,
    GOAL: transactionTotals.goals,
  });
  const transactionCount = transactions.length;

  return (
    <div className="bg-primary-700 rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center min-h-[420px]">
      <h2 className="text-lg font-semibold text-white mb-2 w-full text-center">Análise de Transações</h2>
      <div className="w-full flex flex-col items-center">
        <Bar data={transferBarData} options={transferBarOptions} style={{ maxWidth: 400 }} />
        <div className="text-white text-sm mt-4">
          Total de transações: <span className="font-bold text-white">{transactionCount}</span>
        </div>
      </div>
    </div>
  );
};

export default TransactionsAnalysisCard;