import React, { useEffect } from 'react';
import GoalsCard from './components/cards/GoalsCard';
import TransactionsAnalysisCard from './components/cards/TransactionsAnalysisCard';
import RiskReturnCard from './components/cards/RiskReturnCard';
import InvestmentsCard from './components/cards/InvestmentsCard';
import RedeemModal from './components/modals/RedeemModal';
import FeedbackProvider from 'shared/components/ui/FeedbackProvider';
import { useInvestments } from './hooks/useInvestments';
import { useGoals } from './hooks/useGoals';
import { useRedeemInvestment } from './hooks/useRedeemInvestment';
import InvestmentsHeader from './components/InvestmentsHeader';
import InvestmentsChartSwitcher from './components/InvestmentsChartSwitcher';
import type { InvestmentDTO } from 'shared/dtos/Investment.dto';

const App = () => {
  const { loading, fetchInvestmentsAndTransactions } = useInvestments();
  const goalsHook = useGoals(fetchInvestmentsAndTransactions);
  const redeemHook = useRedeemInvestment(fetchInvestmentsAndTransactions, () => {});

  useEffect(() => {
    if (!loading) {
      goalsHook.loadExistingGoals();
    }
  }, [loading]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><span>Carregando...</span></div>;
  }

  return (
    <>
      <FeedbackProvider />
        <div className="min-h-screen">
          {/* Titulo e resumo */}
          <div className="mb-6 px-6">
            <InvestmentsHeader />
          </div>

          {/* Cards de análise */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
            {/* Riscos vs Retorno */}
            <div className="flex flex-col">
              <RiskReturnCard />
            </div>

            {/* Análise de Transações */}
            <div className="flex flex-col">
              <TransactionsAnalysisCard />
            </div>

            {/* Investimentos */}
            <div className="flex flex-col">
                <InvestmentsCard 
                  fetchInvestmentsAndTransactions={fetchInvestmentsAndTransactions}
                />
            </div>

            {/* Metas */}
            <div className="flex flex-col">
              <GoalsCard fetchInvestmentsAndTransactions={fetchInvestmentsAndTransactions} />
            </div>

            {/* Entradas e Saídas / Investimentos e Metas */}
            <div className="flex flex-col">
              <InvestmentsChartSwitcher />
            </div>
          </div>
        </div>

        {/* Modais */}
        <RedeemModal
          open={redeemHook.showRedeemModal}
          onClose={redeemHook.closeRedeemModal}
          investmentToRedeem={redeemHook.investmentToRedeem ? toInvestmentDTO(redeemHook.investmentToRedeem) : null}
          onConfirm={redeemHook.handleRedeemInvestment}
        />
    </>
  );
};

// Função utilitária para garantir InvestmentDTO
function toInvestmentDTO(inv: any): InvestmentDTO {
  return {
    id: inv.id,
    accountId: inv.accountId,
    type: inv.type,
    amount: inv.amount,
    date: inv.date,
    description: inv.description ?? '',
    goalId: inv.goalId,
    redeemed: inv.redeemed,
    expectedReturn: inv.expectedReturn,
    riskLevel: inv.riskLevel,
  };
}

export default App;
