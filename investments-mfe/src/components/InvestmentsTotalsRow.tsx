import React from 'react';
import { ArrowDownCircle, ArrowUpCircle, PiggyBank, Target, Wallet } from 'lucide-react';
import { useInvestments } from '../hooks/useInvestments';
import { useGoals } from '../hooks/useGoals';
import { calculateTransactionTotals } from '../utils/investmentCalculations';

const InvestmentsTotalsRow: React.FC = () => {
  const { transactions, investments, accountBalance } = useInvestments();
  const { goals } = useGoals();

  const totals = calculateTransactionTotals(transactions, investments, goals);
  const balance = accountBalance ?? 0;

  return (
    <div className="w-full flex flex-row flex-wrap justify-center items-stretch gap-6 mt-8 mb-2">
      <ResumoCard
        color="green"
        label="Entradas"
        value={totals.inflows}
        icon={<ArrowDownCircle className="w-6 h-6 text-green-500" strokeWidth={2.2} />}
      />
      <ResumoCard
        color="red"
        label="Saídas"
        value={totals.outflows}
        icon={<ArrowUpCircle className="w-6 h-6 text-red-500" strokeWidth={2.2} />}
      />
      <ResumoCard
        color="blue"
        label="Investimentos"
        value={totals.totalInvestments}
        icon={<PiggyBank className="w-6 h-6 text-blue-500" strokeWidth={2.2} />}
      />
      <ResumoCard
        color="purple"
        label="Metas"
        value={totals.totalGoals}
        icon={<Target className="w-6 h-6 text-purple-500" strokeWidth={2.2} />}
      />
      <ResumoCard
        color="yellow"
        label="Saldo"
        value={balance}
        icon={<Wallet className="w-6 h-6 text-yellow-500" strokeWidth={2.2} />}
        destaque
      />
    </div>
  );
};

const ResumoCard = ({ color, label, value, icon, destaque }: { color: string; label: string; value: number; icon: React.ReactNode; destaque?: boolean }) => (
  <div
    className={`flex flex-col items-center justify-center bg-white rounded-lg px-2 py-2 shadow border-t-4 border-${color}-400 transition-transform duration-200 hover:scale-105 ${destaque ? 'ring-2 ring-yellow-300 scale-105' : ''}`}
    style={{ minWidth: 120, minHeight: 70 }}
  >
    <div className="mb-1 flex items-center justify-center">{icon}</div>
    <span className={`text-[11px] font-medium text-${color}-700 tracking-wide uppercase`}>{label}</span>
    <span className={`text-lg font-bold text-${color}-700 mt-0.5`}>R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
  </div>
);

export default InvestmentsTotalsRow;
