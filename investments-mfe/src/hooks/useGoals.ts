import { useState, useEffect } from 'react';
import axios from 'axios';

const accountId = 'acc001';

export const useGoals = (fetchInvestmentsAndTransactions: () => void) => {
  const [goals, setGoals] = useState<{ name: string; value: number; deadline?: string; saved: number }[]>([]);
  const [depositValues, setDepositValues] = useState<string[]>([]);
  const [withdrawValues, setWithdrawValues] = useState<string[]>([]);
  const [goalToDelete, setGoalToDelete] = useState<number | null>(null);
  const [widgetMessage, setWidgetMessage] = useState('');

  const loadExistingGoals = async () => {
    try {
      const res = await axios.get(`http://localhost:3034/accounts?id=${accountId}`);
      const account = res.data && res.data[0];
      if (!account) return;

      const cofrinhos = (account.investments || []).filter(inv => inv.type === 'COFRINHO');
      const loadedGoals = cofrinhos.map(cofrinho => ({
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

  const showMessage = (message: string) => {
    setWidgetMessage(message);
    setTimeout(() => setWidgetMessage(''), 3000);
  };

  const handleDeposit = async (idx: number) => {
    const value = depositValues[idx];
    if (!value || Number(value) <= 0) return;
    const depositAmount = Number(value);

    const res = await axios.get(`http://localhost:3034/accounts?id=${accountId}`);
    const account = res.data && res.data[0];
    if (!account || account.balance < depositAmount) {
      showMessage('Saldo insuficiente para depósito!');
      return;
    }

    const cofrinhoDesc = goals[idx].name;
    const investmentsAtualizados = (account.investments || []).map(inv =>
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
    
    showMessage(`R$ ${depositAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} depositado na meta!`);
    fetchInvestmentsAndTransactions();
  };

  const handleWithdraw = async (idx: number) => {
    const value = withdrawValues[idx];
    if (!value || Number(value) <= 0) return;
    const withdrawAmount = Number(value);

    if (withdrawAmount > goals[idx].saved) {
      showMessage('Você não pode sacar mais do que o valor poupado na meta!');
      return;
    }

    const res = await axios.get(`http://localhost:3034/accounts?id=${accountId}`);
    const account = res.data && res.data[0];
    if (!account) return;

    const cofrinhoDesc = goals[idx].name;
    const investmentsAtualizados = (account.investments || []).map(inv =>
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
    
    showMessage(`R$ ${withdrawAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sacado da meta!`);
    fetchInvestmentsAndTransactions();
  };

  const handleDeleteGoal = async (idx: number) => {
    const goal = goals[idx];
    const res = await axios.get(`http://localhost:3034/accounts?id=${accountId}`);
    const account = res.data && res.data[0];
    if (!account) return;

    const updatedInvestments = (account.investments || []).filter(
      inv => !(inv.type === 'COFRINHO' && inv.description === goal.name)
    );

    await axios.patch(`http://localhost:3034/accounts/${account.id}`, {
      investments: updatedInvestments,
      balance: account.balance + (goal.saved || 0)
    });

    setGoals(goals => goals.filter((_, i) => i !== idx));
    setDepositValues(values => values.filter((_, i) => i !== idx));
    setWithdrawValues(values => values.filter((_, i) => i !== idx));
    
    showMessage('Meta excluída e valor devolvido ao saldo!');
    fetchInvestmentsAndTransactions();
  };

  const createGoal = async (goalName: string, savingGoal: string, goalDeadline: string) => {
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

    const res = await axios.get(`http://localhost:3034/accounts?id=${accountId}`);
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
    
    showMessage('Meta criada com sucesso!');
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
    widgetMessage,
    loadExistingGoals,
    handleDeposit,
    handleWithdraw,
    handleDeleteGoal,
    createGoal
  };
};