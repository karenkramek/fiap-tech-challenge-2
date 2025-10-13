import { useEffect } from 'react';
import FeedbackProvider from 'shared/components/ui/FeedbackProvider';
import type { InvestmentDTO } from 'shared/dtos/Investment.dto';
import InvestmentsHeader from './components/InvestmentsHeader';
import GoalsCard from './components/cards/GoalsCard';
import InvestmentsCard from './components/cards/InvestmentsCard';
import RiskReturnCard from './components/cards/RiskReturnCard';
import TransactionsAnalysisCard from './components/cards/TransactionsAnalysisCard';
import TransactionsSummaryCard from './components/cards/TransactionsSummaryCard';
import RedeemModal from './components/modals/RedeemModal';
import { useGoals } from './hooks/useGoals';
import { useInvestments } from './hooks/useInvestments';
import { useRedeemInvestment } from './hooks/useRedeemInvestment';

const App = () => {
  const { loading } = useInvestments();
  const goalsHook = useGoals();
  const redeemHook = useRedeemInvestment(() => {});

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
        <div className="min-h-screen" role="main" aria-label="Painel de investimentos">
          <div className="container mx-auto px-4 space-y-6">
            {/* Titulo e Totalizadores */}
            <div className="mb-6" aria-label="Cabeçalho de investimentos">
              <InvestmentsHeader />
            </div>

            {/* Cards de análise */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-label="Análises e cards de investimentos">
              {/* Riscos vs Retorno */}
              <div className="flex flex-col" aria-label="Risco versus Retorno">
                <RiskReturnCard />
              </div>

              {/* Análise de Transações */}
              <div className="flex flex-col" aria-label="Análise de transações">
                <TransactionsAnalysisCard />
              </div>

              {/* Investimentos */}
              <div className="flex flex-col" aria-label="Investimentos">
                  <InvestmentsCard />
              </div>

              {/* Metas */}
              <div className="flex flex-col" aria-label="Metas de investimento">
                <GoalsCard />
              </div>

              {/* Entradas e Saídas / Investimentos e Metas */}
              <div className="flex flex-col" aria-label="Entradas e saídas, investimentos e metas">
                <TransactionsSummaryCard />
              </div>
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
