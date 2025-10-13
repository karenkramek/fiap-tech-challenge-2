import React from 'react';
import { Bar } from 'react-chartjs-2';
import { createResumoBarData, resumoBarOptions } from '../../config/chartConfigs';
import { useGoals } from '../../hooks/useGoals';
import { useInvestments } from '../../hooks/useInvestments';
import { calculateTransactionTotals } from '../../utils/investmentCalculations';

const TransactionsSummaryCard: React.FC = () => {
  const { transactions, investments } = useInvestments();
  const { goals } = useGoals();

  const transactionTotals = calculateTransactionTotals(transactions, investments, goals);

  const data = createResumoBarData(
    transactionTotals.inflows,
    transactionTotals.outflows,
    transactionTotals.totalInvestments,
    transactionTotals.totalGoals
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center min-h-[420px] mt-8 w-full" role="region" aria-label="Resumo de transações">
      <div className="w-full flex flex-row items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-primary-700 flex items-center gap-2">
          Resumo
        </h2>
      </div>
      <div className="w-full flex flex-col items-center" style={{ height: 220 }} aria-live="polite">
        <Bar data={data} options={resumoBarOptions} />
      </div>
    </div>
  );
};

export default TransactionsSummaryCard;
