import React, { useState } from 'react';
import { Edit, Trash2, PiggyBank } from 'lucide-react';
import Button from 'shared/components/ui/Button';
import ModalWrapper from 'shared/components/ui/ModalWrapper';
import Card from 'shared/components/ui/Card';
import ConfirmationModal from 'shared/components/ui/ConfirmationModal';
import { createCurrencyInputHandler, parseCurrencyStringToNumber } from 'shared/utils/currency';
import { GoalService } from 'shared/services/GoalService';
import { TransactionService } from 'shared/services/TransactionService';
import { showSuccess, showError } from 'shared/components/ui/FeedbackProvider';
import { useGoals } from '../../hooks/useGoals';
import GoalModal from '../modals/GoalModal';
import type { GoalDTO } from 'shared/services/GoalService';
import { useSelector } from 'react-redux';
import { RootState } from 'shared/store';
import { AccountService } from 'shared/services/AccountService';

const GoalsCard: React.FC<{ fetchInvestmentsAndTransactions: () => Promise<void> }> = ({ fetchInvestmentsAndTransactions }) => {
  const { goals, loadExistingGoals, handleAssignValue } = useGoals(fetchInvestmentsAndTransactions);
  const accountId = useSelector((state: RootState) => state.auth.user?.id) || '';
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [selectedGoalIdx, setSelectedGoalIdx] = useState<number | null>(null);
  const [goalToEdit, setGoalToEdit] = useState<GoalDTO | null>(null);
  const [assignValue, setAssignValue] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);
  const [accountBalance, setAccountBalance] = useState<number | null>(null);
  const handleAssignValueChange = createCurrencyInputHandler(setAssignValue);

  const fetchAccountBalance = async () => {
    if (!accountId) return;
    try {
      const account = await AccountService.getAccountById(accountId);
      setAccountBalance(account?.balance ?? null);
    } catch {
      setAccountBalance(null);
    }
  };

  const handleOpenAssignModal = (idx: number) => {
    setSelectedGoalIdx(idx);
    setAssignValue('');
    setAssignModalOpen(true);
    setAssignError(null);
    fetchAccountBalance();
  };

  // Handler para atribuir valor à meta
  const handleAssign = async () => {
    if (selectedGoalIdx !== null && assignValue) {
      setAssignLoading(true);
      setAssignError(null);
      try {
        const valueToAssign = parseCurrencyStringToNumber(assignValue);
        if (typeof accountBalance === 'number' && accountBalance < valueToAssign) {
          setAssignError('Saldo insuficiente para atribuir à meta.');
          setAssignLoading(false);
          return;
        }
        // Passa o goalId para a função de atribuição de valor
        const goalId = goals[selectedGoalIdx].id;
        await handleAssignValue(selectedGoalIdx, valueToAssign, goalId);
        await fetchInvestmentsAndTransactions();
        await loadExistingGoals();
        setTimeout(() => {}, 2500);
        setAssignModalOpen(false);
        setAssignValue('');
      } catch (e) {
      } finally {
        setAssignLoading(false);
      }
    }
  };

  const handleOpenDeleteModal = (idx: number) => {
    setSelectedGoalIdx(idx);
    setDeleteModalOpen(true);
  };

  // Handler para deletar meta
  const handleDelete = async () => {
    if (selectedGoalIdx !== null) {
      const goalId = goals[selectedGoalIdx].id;
      try {
        await GoalService.delete(goalId);
        // Remove transações relacionadas à meta
        await TransactionService.deleteGoalTransactions(goalId);
        await fetchInvestmentsAndTransactions();
        await loadExistingGoals();
        showSuccess('Meta excluída!');
      } catch (e) {
        showError('Erro ao excluir meta.');
      }
      setDeleteModalOpen(false);
    }
  };

  const handleSaveGoal = async (goal: { name: string; value: number; deadline?: string }) => {
    try {
      if (goalToEdit) {
        const updateData: Partial<GoalDTO> = {
          name: goal.name,
          value: goal.value,
          ...(goal.deadline ? { deadline: goal.deadline } : {})
        };
        await GoalService.update(goalToEdit.id, updateData);
        showSuccess('Meta atualizada!');
      } else {
        const newGoal: GoalDTO = {
          id: Math.random().toString(36).substring(2, 9),
          accountId,
          name: goal.name,
          value: goal.value,
          assigned: 0,
          createdAt: new Date().toISOString(),
          ...(goal.deadline ? { deadline: goal.deadline } : {})
        };
        await GoalService.create(newGoal);
        showSuccess('Meta criada!');
      }
      setGoalModalOpen(false);
      setGoalToEdit(null);
      await loadExistingGoals();
      await fetchInvestmentsAndTransactions();
    } catch (e) {
      // Se houver showError no shared, pode usar aqui
    }
  };

  return (
    <Card className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center min-h-[420px] mt-8 w-full">
      {/* Título */}
      <div className="w-full flex flex-row items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-primary-700 flex items-center gap-2">
          Metas
        </h2>
        <Button
          onClick={() => {
            setGoalToEdit(null);
            setGoalModalOpen(true);
          }}
          className="inline-block bg-primary-700 text-white-50 px-4 py-2 rounded hover:bg-primary-600 transition-colors text-sm font-medium"
        >
          Nova Meta
        </Button>
      </div>

      {/* Conteúdo vazio */}
      {goals.length === 0 && (
        <div className="flex flex-col items-center justify-center flex-1 w-full py-12">
          <span className="text-base text-primary-700 font-semibold mb-2 text-center">
            Nenhuma meta cadastrada ainda.
          </span>
          <span className="text-sm text-gray-500 mb-6 text-center max-w-xs">
            Crie uma meta personalizada para planejar, poupar e conquistar seus objetivos.
          </span>
        </div>
      )}

      {/* Conteúdo com dados */}
      {goals.length > 0 && (
        <div className="w-full flex flex-col gap-4">
          {goals.map((goal, idx) => {
            const percent = Math.min(100, (goal.assigned / goal.value) * 100);
            const progressColor = percent >= 100 ? 'bg-success-700' : '';
            const progressStyle = percent >= 100 ? {} : { backgroundColor: '#6da5bc' };
            const metaAtingida = percent >= 100;
            return (
              <div key={goal.id} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 flex flex-col gap-3 shadow transition relative overflow-hidden">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-primary-800">{goal.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="p-1 hover:bg-primary-50 rounded"
                      title="Atribuir valor"
                      aria-label="Atribuir valor à meta"
                      onClick={() => handleOpenAssignModal(idx)}
                    >
                      <PiggyBank className="h-5 w-5 text-white-800 hover:text-primary-700 cursor-pointer" />
                    </button>
                    <button
                      className="p-1 hover:bg-primary-50 rounded"
                      title="Editar meta"
                      aria-label="Editar meta"
                      onClick={() => {
                        setGoalToEdit(goal);
                        setGoalModalOpen(true);
                      }}
                    >
                      <Edit className="h-5 w-5 text-white-800 hover:text-primary-700 cursor-pointer" />
                    </button>
                    <button
                      className="p-1 hover:bg-error-50 rounded"
                      title="Excluir"
                      aria-label="Excluir meta"
                      onClick={() => handleOpenDeleteModal(idx)}
                    >
                      <Trash2 className="h-5 w-5 text-white-800 hover:text-error-700 cursor-pointer" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-row gap-2 items-center mb-2">
                  <span className="text-xs text-gray-500">Criada em: {new Date(goal.createdAt).toLocaleDateString('pt-BR')}</span>
                  {goal.deadline && (
                    <span className="text-xs text-gray-500">| Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}</span>
                  )}
                </div>
                {/* Barra de progresso animada */}
                <div className="relative w-full h-8 rounded bg-gray-200 overflow-hidden mb-1 border border-gray-300 shadow-inner">
                  {/* Barra preenchida */}
                  <div
                    className={`absolute left-0 top-0 h-full transition-all duration-700 ${progressColor}`}
                    style={{ width: `${Math.min(percent, 100)}%`, ...progressStyle }}
                  />
                  {/* Conteúdo da barra */}
                  <div className="relative z-10 flex items-center justify-between h-full px-3 text-xs font-bold">
                    <span className="flex items-center gap-2 text-primary-700 font-bold">
                      <PiggyBank className="w-4 h-4" />
                      {goal.assigned.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / {goal.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-primary-700 font-bold">{percent.toFixed(0)}%</span>
                  </div>

                  {/* Badge de meta atingida */}
                  {metaAtingida && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-primary-700 px-3 py-1 font-bold flex items-center gap-2">
                        Meta atingida!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de confirmação de exclusão de meta */}
      <ConfirmationModal
        open={deleteModalOpen && selectedGoalIdx !== null && !!goals[selectedGoalIdx]}
        title="Excluir meta"
        description={(() => {
          const goal = selectedGoalIdx !== null ? goals[selectedGoalIdx] : undefined;
          if (!goal) return null;
          return (
            <div className="flex flex-col items-center text-center gap-2">
              <span>
                Tem certeza que deseja excluir a meta: <strong>"{goal.name}"</strong>?
              </span>
              <strong>Esta ação não poderá ser desfeita.</strong>
              {goal.assigned > 0 && (
                <span className="text-sm">O valor de <strong>R$ {goal.assigned.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> será devolvido ao seu saldo.</span>
              )}
            </div>
          );
        })()}
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
        loading={false}
        size="md"
      />

      {/* Modal de atribuição de valor */}
      <ModalWrapper open={assignModalOpen} onClose={() => { setAssignModalOpen(false); }} title="Atribuir valor à meta" size="sm">
        <form onSubmit={e => { e.preventDefault(); handleAssign(); }} className="space-y-5 mt-2">
          {typeof accountBalance === 'number' && (
            <div>
              <span className="block text-gray-600 text-sm mb-1">Saldo disponível:</span>
              <span className="text-lg font-bold text-primary-700">
                R$ {accountBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}
          <div>
            <label className="block text-md font-bold text-primary-700 mb-1">Valor *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white-800">R$</span>
              <input
                type="text"
                value={assignValue}
                onChange={handleAssignValueChange}
                inputMode="numeric"
                placeholder="00,00"
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-primary-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-700"
                required
                disabled={assignLoading}
              />
            </div>
          </div>
          {assignError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {assignError}
            </div>
          )}
          <div className='flex gap-4 pt-4'>
            <Button type='submit' variant='active' className='w-full py-3 bg-tertiary-600 hover:bg-tertiary-700 text-white-50 font-medium rounded-lg shadow-md' disabled={!assignValue || parseCurrencyStringToNumber(assignValue) <= 0 || assignLoading}>
              {assignLoading ? 'Atribuindo...' : 'Atribuir'}
            </Button>
          </div>
        </form>
      </ModalWrapper>

      {/* Modal de criação/edição de meta */}
      <GoalModal
        open={goalModalOpen}
        onClose={() => setGoalModalOpen(false)}
        onSave={handleSaveGoal}
        initialGoal={goalToEdit}
      />
      
    </Card>
  );
};

export default GoalsCard;