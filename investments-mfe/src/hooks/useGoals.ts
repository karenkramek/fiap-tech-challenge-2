import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from 'shared/store';
import { showSuccess, showError } from 'shared/components/ui/FeedbackProvider';

// Tipos auxiliares para investimentos e cofrinhos
interface Investment {
  type: string;
  description?: string;
  amount?: number;
  goalValue?: number;
  deadline?: string;
}
interface Account {
  id: string;
  investments?: Investment[];
  balance: number;
}

export const useGoals = (fetchInvestmentsAndTransactions: () => void) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [goals, setGoals] = useState<{ name: string; value: number; deadline?: string; saved: number }[]>([]);
  const [depositValues, setDepositValues] = useState<string[]>([]);
  const [withdrawValues, setWithdrawValues] = useState<string[]>([]);
  const [goalToDelete, setGoalToDelete] = useState<number | null>(null);

  const loadExistingGoals = async () => {
    if (!user?.id) return;
    try {
      const res = await axios.get(`http://localhost:3034/accounts?id=${user.id}`);
      const account: Account | undefined = res.data && res.data[0];
      if (!account) return;

      const cofrinhos = (account.investments || []).filter((inv: Investment) => inv.type === 'COFRINHO');
      const loadedGoals = cofrinhos.map((cofrinho: Investment) => ({
        name: cofrinho.description || 'Meta sem nome',
        value: cofrinho.goalValue || 0,
        deadline: cofrinho.deadline || '',
        saved: cofrinho.amount || 0
      }));

      setGoals(loadedGoals);
      setDepositValues(new Array(loadedGoals.length).fill(''));
      setWithdrawValues(new Array(loadedGoals.length).fill(''));
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
    }
  };

  const handleDeposit = async (idx: number) => {
    if (!user?.id) return;
    const value = depositValues[idx];
    if (!value || Number(value) <= 0) return;
    const depositAmount = Number(value);

    const res = await axios.get(`http://localhost:3034/accounts?id=${user.id}`);
    const account = res.data && res.data[0];
    if (!account || account.balance < depositAmount) {
      showError('Saldo insuficiente para depósito!');
      return;
    }

    const cofrinhoDesc = goals[idx].name;
    const investmentsAtualizados = (account.investments || []).map((inv: Investment) =>
      inv.type === 'COFRINHO' && inv.description === cofrinhoDesc
        ? { ...inv, amount: (inv.amount || 0) + depositAmount }
        : inv
    );

    await axios.patch(`http://localhost:3034/accounts/${account.id}`, {
      investments: investmentsAtualizados,
      balance: account.balance - depositAmount
    });

    setGoals(goals =>
      goals.map((g, i) =>
        i === idx ? { ...g, saved: Math.min(g.saved + depositAmount, g.value) } : g
      )
    );
    
    setDepositValues(values => {
      const arr = [...values];
      arr[idx] = '';
      return arr;
    });
    
    showSuccess(`R$ ${depositAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} depositado na meta!`);
    fetchInvestmentsAndTransactions();
  };

  const handleWithdraw = async (idx: number) => {
    if (!user?.id) return;
    const value = withdrawValues[idx];
    if (!value || Number(value) <= 0) return;
    const withdrawAmount = Number(value);

    if (withdrawAmount > goals[idx].saved) {
      showError('Você não pode sacar mais do que o valor poupado na meta!');
      return;
    }

    const res = await axios.get(`http://localhost:3034/accounts?id=${user.id}`);
    const account = res.data && res.data[0];
    if (!account) return;

    const cofrinhoDesc = goals[idx].name;
    const investmentsAtualizados = (account.investments || []).map((inv: Investment) =>
      inv.type === 'COFRINHO' && inv.description === cofrinhoDesc
        ? { ...inv, amount: Math.max((inv.amount || 0) - withdrawAmount, 0) }
        : inv
    );

    await axios.patch(`http://localhost:3034/accounts/${account.id}`, {
      investments: investmentsAtualizados,
      balance: account.balance + withdrawAmount
    });

    setGoals(goals =>
      goals.map((g, i) =>
        i === idx ? { ...g, saved: Math.max(g.saved - withdrawAmount, 0) } : g
      )
    );
    
    setWithdrawValues(values => {
      const arr = [...values];
      arr[idx] = '';
      return arr;
    });
    
    showSuccess(`R$ ${withdrawAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sacado da meta!`);
    fetchInvestmentsAndTransactions();
  };

  const handleDeleteGoal = async (idx: number) => {
    if (!user?.id) return;
    const goal = goals[idx];
    const res = await axios.get(`http://localhost:3034/accounts?id=${user.id}`);
    const account = res.data && res.data[0];
    if (!account) return;

    const updatedInvestments = (account.investments || []).filter((inv: Investment) =>
      !(inv.type === 'COFRINHO' && inv.description === goal.name)
    );

    await axios.patch(`http://localhost:3034/accounts/${account.id}`, {
      investments: updatedInvestments,
      balance: account.balance + (goal.saved || 0)
    });

    setGoals(goals => goals.filter((_, i) => i !== idx));
    setDepositValues(values => values.filter((_, i) => i !== idx));
    setWithdrawValues(values => values.filter((_, i) => i !== idx));
    
    showSuccess('Meta excluída e valor devolvido ao saldo!');
    fetchInvestmentsAndTransactions();
  };

  const createGoal = async (goalName: string, savingGoal: string, goalDeadline: string) => {
    if (!user?.id) throw new Error('Usuário não autenticado.');
    if (!goalName.trim() || !savingGoal || Number(savingGoal) <= 0) {
      throw new Error('Por favor, preencha o nome da meta e um valor válido.');
    }

    const newCofrinho = {
      id: Math.random().toString(36).substring(2, 9),
      type: 'COFRINHO',
      amount: 0,
      description: goalName,
      deadline: goalDeadline,
      goalValue: Number(savingGoal),
      date: new Date().toISOString()
    };

    const res = await axios.get(`http://localhost:3034/accounts?id=${user.id}`);
    const account = res.data && res.data[0];
    if (!account) throw new Error('Erro ao carregar conta.');

    await axios.patch(`http://localhost:3034/accounts/${account.id}`, {
      investments: [...(account.investments || []), newCofrinho]
    });

    const newGoal = {
      name: goalName,
      value: Number(savingGoal),
      deadline: goalDeadline,
      saved: 0
    };

    setGoals(prevGoals => [...prevGoals, newGoal]);
    setDepositValues(prev => [...prev, '']);
    setWithdrawValues(prev => [...prev, '']);
    
    showSuccess('Meta criada com sucesso!');
    fetchInvestmentsAndTransactions();
  };

  return {
    goals,
    depositValues,
    setDepositValues,
    withdrawValues,
    setWithdrawValues,
    goalToDelete,
    setGoalToDelete,
    loadExistingGoals,
    handleDeposit,
    handleWithdraw,
    handleDeleteGoal,
    createGoal
  };
};