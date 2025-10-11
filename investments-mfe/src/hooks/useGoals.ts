import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'shared/store';
// Remover import de showSuccess, showError
import { GoalService, GoalDTO } from 'shared/services/GoalService';
import { AccountService } from 'shared/services/AccountService';
import { TransactionService } from 'shared/services/TransactionService';
import { TransactionType } from 'shared/types/TransactionType';

export const useGoals = (fetchInvestmentsAndTransactions: () => void) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [goals, setGoals] = useState<GoalDTO[]>([]);
  const [assignValues, setAssignValues] = useState<string[]>([]);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);

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

    setGoals(goals =>
      goals.map((g, i) =>
        i === idx ? { ...g, assigned: (g.assigned || 0) + value } : g
      )
    );
    await GoalService.update(goal.id, { assigned: (goal.assigned || 0) + value });
    await TransactionService.addTransaction(
      account.id,
      TransactionType.GOAL,
      value,
      new Date(),
      `Atribuição à meta: ${goal.name}`,
      undefined, // attachmentFile
      goalId || goal.id // goalId sempre presente
    );
    fetchInvestmentsAndTransactions();
  };

  // Exclui meta
  const handleDeleteGoal = async (idx: number) => {
    if (!user?.id) return;
    const goal = goals[idx];
    if (!goal) return;
    await GoalService.update(goal.id, { assigned: 0 });
    setGoals(goals => goals.filter((_, i) => i !== idx));
    setAssignValues(values => values.filter((_, i) => i !== idx));
    fetchInvestmentsAndTransactions();
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
    // showSuccess removido, feedback fica no componente
    fetchInvestmentsAndTransactions();
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

  return {
    goals,
    setGoals,
    assignValues,
    setAssignValues,
    goalToDelete,
    setGoalToDelete,
    loadExistingGoals,
    handleAssignValue,
    handleDeleteGoal,
    createGoal
  };
};