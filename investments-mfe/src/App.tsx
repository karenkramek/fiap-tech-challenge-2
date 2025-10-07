import React, { useEffect } from 'react';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement } from 'chart.js';
import GoalsCard from './components/cards/GoalsCard';
import TransactionsAnalysisCard from './components/cards/TransactionsAnalysisCard';
import InflowsOutflowsCard from './components/cards/InflowsOutflowsCard';
import RiskReturnCard from './components/cards/RiskReturnCard';
import SummaryCard from './components/cards/SummaryCard';
import InvestmentModal from './components/modals/InvestmentModal';
import GoalModal from './components/modals/GoalModal';
import DeleteGoalModal from './components/modals/DeleteGoalModal';
import RedeemModal from './components/modals/RedeemModal';
import InsufficientFundsModal from './components/modals/InsufficientFundsModal';
import { useInvestments } from './hooks/useInvestments';
import { useModals } from './hooks/useModals';
import { useInvestmentOperations } from './hooks/useInvestmentOperations';
import { useGoals } from './hooks/useGoals';
import { useGoalModal } from './hooks/useGoalModal';
import { useRedeemInvestment } from './hooks/useRedeemInvestment';
import { calculateInvestmentTotals, calculateTransactionTotals } from './utils/investmentCalculations';
import {
  createDoughnutData,
  doughnutOptions,
  createTransferBarData,
  transferBarOptions,
  createEntradaSaidaData,
  entradaSaidaOptions,
  createScatterData,
  scatterOptions,
  riskReturnData
} from './config/chartConfigs';
import './styles/styles.css';
import LoadingSpinner from 'shared/components/ui/LoadingSpinner';
import FeedbackProvider from 'shared/components/ui/FeedbackProvider';
import { useSelector } from 'react-redux';
import { RootState } from 'shared/store';

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement);

const App = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  // Hooks customizados
  const { transactions, investments, loading, accountBalance, fetchInvestmentsAndTransactions } = useInvestments();
  const modals = useModals();
  const investmentOps = useInvestmentOperations();
  // Hooks para metas
  const goalsHook = useGoals(fetchInvestmentsAndTransactions);
  const goalModalHook = useGoalModal(goalsHook.createGoal);
  // Hook para resgate
  const redeemHook = useRedeemInvestment(fetchInvestmentsAndTransactions, () => {});
  // Carregar metas quando loading terminar
  useEffect(() => {
    if (!loading) {
      goalsHook.loadExistingGoals();
    }
  }, [loading]);
  // Cálculos
  const allInvestments = [
    ...investments,
    ...transactions.filter(tx =>
      ['FUNDOS', 'TESOURO', 'PREVIDENCIA', 'BOLSA'].includes(tx.type)
    )
  ];
  const investmentTotals = calculateInvestmentTotals(allInvestments);
  const transactionTotals = calculateTransactionTotals(transactions);
  // Dados dos gráficos
  const doughnutData = createDoughnutData(
    investmentTotals.fundos,
    investmentTotals.tesouro,
    investmentTotals.previdencia,
    investmentTotals.bolsa
  );
  const transferBarData = createTransferBarData(
    transactionTotals.deposits,
    transactionTotals.payments,
    transactionTotals.transfers,
    transactionTotals.withdrawals
  );
  const entradaSaidaData = createEntradaSaidaData(
    transactionTotals.entradas,
    transactionTotals.saidas
  );
  const scatterData = createScatterData();
  const hasInvestments = [
    investmentTotals.fundos,
    investmentTotals.tesouro,
    investmentTotals.previdencia,
    investmentTotals.bolsa
  ].some(v => v > 0);
  // Handler para investimento
  const handleInvestmentSubmit = (e: React.FormEvent) => {
    if (!user?.id) return;
    investmentOps.handleInvestmentSubmit(
      e,
      accountBalance,
      modals.setShowInsufficientFunds,
      modals.setShowModal,
      fetchInvestmentsAndTransactions
    );
  };
  // Handlers para exclusão de metas
  const confirmDeleteGoal = async () => {
    if (!user?.id) return;
    if (goalsHook.goalToDelete === null) return;
    await goalsHook.handleDeleteGoal(goalsHook.goalToDelete);
    goalModalHook.setShowDeleteModal(false);
    goalsHook.setGoalToDelete(null);
  };
  if (loading) {
    return <LoadingSpinner size={48} />;
  }
  return (
    <>
      <FeedbackProvider />
      <div className="flex flex-col gap-8 px-2 sm:px-4 py-8 max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary-700 mb-1">Investimentos</h1>
            <p className="text-gray-500 text-base">Gerencie e acompanhe seus investimentos de forma simples e visual.</p>
          </div>
        </header>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SummaryCard
            hasInvestments={hasInvestments}
            total={investmentTotals.total}
            rendaFixa={investmentTotals.rendaFixa}
            rendaVariavel={investmentTotals.rendaVariavel}
            data={doughnutData}
            options={doughnutOptions}
            setShowModal={modals.setShowModal}
          />
          <RiskReturnCard
            scatterData={scatterData}
            scatterOptions={scatterOptions}
            riskReturnData={riskReturnData}
          />
        </section>
        {/* Seção de investimentos existentes */}
        {hasInvestments && (
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mt-8">
            <h2 className="text-lg font-bold text-primary-700 mb-4">Meus Investimentos</h2>
            <div className="flex flex-col gap-3">
              {investments
                .filter(inv => inv.type !== 'COFRINHO')
                .map(inv => (
                  <div key={inv.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b py-2 gap-2">
                    <div>
                      <span className="font-semibold">{inv.description || inv.type}</span>
                      <span className="ml-2 text-gray-500 text-xs">
                        {inv.date ? new Date(inv.date).toLocaleDateString('pt-BR') : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-primary-700">
                        R$ {inv.amount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition text-xs font-semibold"
                        onClick={() => redeemHook.openRedeemModal(inv)}
                        aria-label={`Resgatar investimento ${inv.description || inv.type}`}
                      >
                        Resgatar
                      </button>
                    </div>
                  </div>
                ))}
              {investments.filter(inv => inv.type !== 'COFRINHO').length === 0 && (
                <span className="text-gray-500 text-sm">Nenhum investimento disponível para resgate.</span>
              )}
            </div>
          </div>
        )}
        <div className="w-full mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TransactionsAnalysisCard
              transferBarData={transferBarData}
              transferBarOptions={transferBarOptions}
              transactionCount={transactions.length}
            />
            <InflowsOutflowsCard
              entradaSaidaData={entradaSaidaData}
              entradaSaidaOptions={entradaSaidaOptions}
              entradas={transactionTotals.entradas}
              saidas={transactionTotals.saidas}
            />
          </div>
          <GoalsCard
            savingGoal={goalModalHook.savingGoal}
            setSavingGoal={goalModalHook.setSavingGoal}
            handleSaveGoal={goalModalHook.handleSaveGoal}
            goals={goalsHook.goals}
            depositValues={goalsHook.depositValues}
            setDepositValues={goalsHook.setDepositValues}
            withdrawValues={goalsHook.withdrawValues}
            setWithdrawValues={goalsHook.setWithdrawValues}
            handleDeposit={goalsHook.handleDeposit}
            handleWithdraw={goalsHook.handleWithdraw}
            openDeleteGoalModal={(idx) => {
              goalsHook.setGoalToDelete(idx);
              goalModalHook.setShowDeleteModal(true);
            }}
          />
        </div>
        {/* Modais */}
        <InvestmentModal
          showModal={modals.showModal}
          setShowModal={modals.setShowModal}
          accountBalance={accountBalance}
          investmentType={investmentOps.investmentType}
          setInvestmentType={investmentOps.setInvestmentType}
          investmentAmount={investmentOps.investmentAmount}
          setInvestmentAmount={investmentOps.setInvestmentAmount}
          investmentDesc={investmentOps.investmentDesc}
          setInvestmentDesc={investmentOps.setInvestmentDesc}
          onSubmit={handleInvestmentSubmit}
        />
        <GoalModal
          showGoalModal={goalModalHook.showGoalModal}
          setShowGoalModal={goalModalHook.setShowGoalModal}
          goalName={goalModalHook.goalName}
          setGoalName={goalModalHook.setGoalName}
          goalDeadline={goalModalHook.goalDeadline}
          setGoalDeadline={goalModalHook.setGoalDeadline}
          savingGoal={goalModalHook.savingGoal}
          setSavingGoal={goalModalHook.setSavingGoal}
          onConfirm={goalModalHook.handleConfirmGoal}
        />
        <InsufficientFundsModal
          show={modals.showInsufficientFunds}
          onClose={() => modals.setShowInsufficientFunds(false)}
        />
        <RedeemModal
          showRedeemModal={redeemHook.showRedeemModal}
          investmentToRedeem={redeemHook.investmentToRedeem}
          onConfirm={redeemHook.handleRedeemInvestment}
          onClose={redeemHook.closeRedeemModal}
        />
        <DeleteGoalModal
          showDeleteModal={goalModalHook.showDeleteModal}
          goalToDelete={goalsHook.goalToDelete}
          goals={goalsHook.goals}
          onConfirm={confirmDeleteGoal}
          onClose={() => {
            goalModalHook.setShowDeleteModal(false);
            goalsHook.setGoalToDelete(null);
          }}
        />
      </div>
    </>
  );
};

export default App;
