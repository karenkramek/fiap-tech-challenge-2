import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import Button from 'shared/components/ui/Button';
import { calculateInvestmentTotals } from '../../utils/investmentCalculations';
import { createDoughnutData, doughnutOptions } from '../../config/chartConfigs';
import { useInvestments } from '../../hooks/useInvestments';
import InvestmentModal from '../modals/InvestmentModal';
import Card from 'shared/components/ui/Card';
import ConfirmationModal from 'shared/components/ui/ConfirmationModal';
import { TransactionService } from 'shared/services/TransactionService';
import { showSuccess, showError } from 'shared/components/ui/FeedbackProvider';
import { useSelector } from 'react-redux';
import { RootState } from 'shared/store';

interface InvestmentsCardProps {
  fetchInvestmentsAndTransactions: () => Promise<void>;
  onAddInvestment?: () => void;
}

const InvestmentsCard: React.FC<InvestmentsCardProps> = ({ fetchInvestmentsAndTransactions }) => {
  const { investments } = useInvestments();
  const totals = calculateInvestmentTotals(investments);
  const hasInvestments = totals.total > 0;
  const data = createDoughnutData(totals.funds, totals.treasury, totals.pension, totals.stocks);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [investmentModalOpen, setInvestmentModalOpen] = useState(false);
  const [editInvestment, setEditInvestment] = useState(null);
  const user = useSelector((state: RootState) => state.auth.user);

  const handleAddInvestment = () => {
    setEditInvestment(null);
    setInvestmentModalOpen(true);
  };

  const handleRedeemInvestments = async () => {
    setRedeemLoading(true);
    try {
      if (!user?.id) throw new Error('Usuário não autenticado');
      await TransactionService.redeemAllInvestments(user.id);
      showSuccess('Investimentos resgatados!');
      await fetchInvestmentsAndTransactions();
      setShowRedeemModal(false);
    } catch (e) {
      showError('Erro ao resgatar investimentos.');
    } finally {
      setRedeemLoading(false);
    }
  };

  return (
    <Card className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center min-h-[420px] mt-8 w-full">
      {/* Título */}
      <div className="w-full flex flex-row items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-primary-700 flex items-center gap-2">
          Investimentos
        </h2>
        <Button
          onClick={handleAddInvestment}
          className="inline-block bg-primary-700 text-white-50 px-4 py-2 rounded hover:bg-primary-600 transition-colors text-sm font-medium"
        >
          Novo Investimento
        </Button>
      </div>

      {/* Conteúdo vazio */}
      {!hasInvestments && (
        <div className="flex flex-col items-center justify-center flex-1 w-full py-12">
          <span className="text-base text-primary-700 font-semibold mb-2 text-center">
            Você ainda não possui investimentos.
          </span>
          <span className="text-sm text-gray-500 mb-6 text-center max-w-xs">
            Comece agora mesmo a investir e acompanhe seus resultados por aqui!
          </span>
        </div>
      )}

      {/* Conteúdo com dados */}
      {hasInvestments && (
        <>

          <div className="w-full flex flex-col items-center">
            <div className="flex flex-row items-center justify-center w-full gap-8">
              <div className="flex justify-center items-center">
                <div style={{ width: 180, height: 180 }}>
                  <Doughnut data={data} options={doughnutOptions} />
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm items-start min-w-[170px]">
                <div className="flex items-center gap-2 text-gray-800">
                  <span style={{ background: '#2563eb', width: 12, height: 12, borderRadius: 6, display: 'inline-block' }} />
                  Fundos de investimento
                </div>
                <div className="flex items-center gap-2 text-gray-800">
                  <span style={{ background: '#f59e42', width: 12, height: 12, borderRadius: 6, display: 'inline-block' }} />
                  Tesouro Direto
                </div>
                <div className="flex items-center gap-2 text-gray-800">
                  <span style={{ background: '#a21caf', width: 12, height: 12, borderRadius: 6, display: 'inline-block' }} />
                  Previdência Privada
                </div>
                <div className="flex items-center gap-2 text-gray-800">
                  <span style={{ background: '#ef4444', width: 12, height: 12, borderRadius: 6, display: 'inline-block' }} />
                  Bolsa de Valores
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-6 mb-6 w-full justify-center">
            <div className="flex gap-6 mt-6 w-full justify-center">
              <div className="flex flex-col items-center">
                <span className="text-gray-500 text-sm">Renda Fixa</span>
                <span className="text-lg font-semibold text-primary-700">
                  {`R$ ${totals.fixedIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-gray-500 text-sm">Renda Variável</span>
                <span className="text-lg font-semibold text-primary-700">
                  {`R$ ${totals.variableIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-gray-500 text-sm">Total Investido</span>
                <span className="text-lg font-semibold text-primary-700">
                  {`R$ ${totals.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center w-full mt-2">
            <Button
              className="w-full bg-tertiary-600 hover:bg-tertiary-700 text-white-50 font-bold text-lg py-3 rounded-lg shadow-md transition-colors"
              onClick={() => setShowRedeemModal(true)}
            >
              Resgatar
            </Button>
          </div>

          {/* Modal de confirmação de resgate */}
          <ConfirmationModal
            open={showRedeemModal}
            title="Resgatar investimentos"
            description={
              <div className="flex flex-col items-center text-center gap-2">
                <span>Deseja resgatar seus investimentos?</span>
                <span className="text-sm">
                  O valor de <strong>R$ {totals.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> será adicionado ao seu saldo.
                </span>
              </div>
            }
            showCancelButton={false} 
            confirmVariant="success"
            confirmText="Resgatar"
            onConfirm={handleRedeemInvestments}
            onCancel={() => setShowRedeemModal(false)}
            loading={redeemLoading}
            size="md"
          />
        </>
      )}

      {/* Modais */}
      <InvestmentModal 
        open={investmentModalOpen}
        onClose={() => setInvestmentModalOpen(false)}
        editInvestment={editInvestment}
      />
    </Card>
  );
};

export default InvestmentsCard;