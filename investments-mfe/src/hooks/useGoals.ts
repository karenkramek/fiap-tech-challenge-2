import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AccountService } from 'shared/services/AccountService';
import { GoalDTO, GoalService } from 'shared/services/GoalService';
import { TransactionService } from 'shared/services/TransactionService';
import { RootState } from 'shared/store';
import { TransactionType } from 'shared/types/TransactionType';

export const useGoals = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [goals, setGoals] = useState<GoalDTO[]>([]);
  const [assignValues, setAssignValues] = useState<string[]>([]);
  const [goalsModalOpen, setGoalsModalOpen] = useState(false);
  const [editGoal, setEditGoal] = useState<GoalDTO | null>(null);

  const loadExistingGoals = async () => {
    if (!user?.id) return;
    try {
      const loadedGoals = await GoalService.getAll(user.id);
      setGoals(loadedGoals);
      setAssignValues(new Array(loadedGoals.length).fill(''));
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
    }
  };

  const handleAssignValue = async (idx: number, value: number, goalId?: string) => {
    if (!user?.id) return;
    if (!value || value <= 0) return;
    const goal = goals[idx];
    if (!goal) return;
    // Busca conta
    const account = await AccountService.getAccountById(goal.accountId);
    if (!account || account.balance < value) {
      return;
    }
    // Cria a transação primeiro (que debita o saldo)
    await TransactionService.addTransaction(
      account.id,
      TransactionType.GOAL,
      value,
      new Date(),
      goal.name, // description da transação é o nome da meta
      undefined, // attachmentFile
      goalId || goal.id, // goalId,
      undefined // investmentId
    );
    // Só depois atualiza o assigned da meta
    setGoals(goals =>
      goals.map((g, i) =>
        i === idx ? { ...g, assigned: (g.assigned || 0) + value } : g
      )
    );
    await GoalService.update(goal.id, { assigned: (goal.assigned || 0) + value });
    window.dispatchEvent(new CustomEvent('userDataChanged', {
      detail: { userId: user.id, type: 'goal-value-assigned' }
    }));
  };

  // Cria nova meta
  const createGoal = async (goalName: string, savingGoal: string, goalDeadline: string) => {
    if (!user?.id) throw new Error('Usuário não autenticado.');
    if (!goalName.trim() || !savingGoal || Number(savingGoal) <= 0) {
      throw new Error('Por favor, preencha o nome da meta e um valor válido.');
    }
    const newGoal: GoalDTO = {
      id: Math.random().toString(36).substring(2, 9),
      accountId: user.id,
      name: goalName,
      value: Number(savingGoal),
      assigned: 0,
      createdAt: new Date().toISOString(),
      deadline: goalDeadline
    };
    await GoalService.create(newGoal);
    setGoals(prevGoals => [...prevGoals, newGoal]);
    setAssignValues(prev => [...prev, '']);
    window.dispatchEvent(new CustomEvent('userDataChanged', {
      detail: { userId: user.id, type: 'goal-created' }
    }));
  };

  // Edita meta existente
  const updateGoal = async (goalId: string, data: Partial<GoalDTO>) => {
    await GoalService.update(goalId, data);
    window.dispatchEvent(new CustomEvent('userDataChanged', {
      detail: { userId: user?.id, type: 'goal-updated' }
    }));
    await loadExistingGoals();
  };

  useEffect(() => {
    loadExistingGoals();
    const handleUserDataChanged = (e: any) => {
      if (!e.detail || e.detail.userId === user?.id) {
        loadExistingGoals();
      }
    };
    window.addEventListener('userDataChanged', handleUserDataChanged);
    return () => window.removeEventListener('userDataChanged', handleUserDataChanged);
  }, [user?.id]);

  // Controle de modal de meta
  const openGoalsModal = (goal?: GoalDTO) => {
    setEditGoal(goal || null);
    setGoalsModalOpen(true);
  };
  const closeGoalsModal = () => {
    setEditGoal(null);
    setGoalsModalOpen(false);
  };

  return {
    goals,
    setGoals,
    assignValues,
    setAssignValues,
    loadExistingGoals,
    handleAssignValue,
    createGoal,
    updateGoal,
    // Modal
    goalsModalOpen,
    openGoalsModal,
    closeGoalsModal,
    editGoal
  };
};
