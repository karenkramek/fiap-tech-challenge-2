import React from 'react';
import { Bar } from 'react-chartjs-2';

interface TransactionsAnalysisCardProps {
  transferBarData: any;
  transferBarOptions: any;
  transactionCount: number;
}

const TransactionsAnalysisCard: React.FC<TransactionsAnalysisCardProps> = ({
  transferBarData,
  transferBarOptions,
  transactionCount,
}) => (
  <div className="bg-primary-700 rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center min-h-[420px]">
    <h2 className="text-xl font-bold text-white mb-4">Análise de Transações</h2>
    <div className="w-full flex flex-col items-center">
      <Bar data={transferBarData} options={transferBarOptions} style={{ maxWidth: 400 }} />
      <div className="text-white text-sm mt-4">
        Total de transações: <span className="font-bold text-white">{transactionCount}</span>
      </div>
    </div>
  </div>
);

export default TransactionsAnalysisCard;