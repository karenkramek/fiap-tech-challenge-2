'use client';

import { useCallback, useEffect, useState } from 'react';
import { Transaction } from '../models/Transaction';
import { TransactionService } from '../services/TransactionService';
import { TransactionType } from '../types/TransactionType';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  // Ordena por data decrescente, e por id crescente em caso de empate
  const sortTransactions = (txs: Transaction[]) => {
    return [...txs].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (dateA !== dateB) {
        return dateB - dateA; // data mais recente primeiro
      }
      // Se datas iguais, mantém ordem de inserção pelo id
      return a.id.localeCompare(b.id);
    });
  };

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      if (!user) {
        setTransactions([]);
        setError(null);
        return;
      }
      const data = await TransactionService.getAllTransactions(user.id);
      setTransactions(sortTransactions(data));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch transactions'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Função para limpar transações localmente (usada após criar conta)
  const clearTransactions = useCallback(() => {
    setTransactions([]);
  }, []);

  // Detectar mudança de usuário e recarregar transações
  useEffect(() => {
    if (user?.id !== currentUserId) {
      setCurrentUserId(user?.id || null);
      fetchTransactions();
    }
    // Escutar evento customizado de limpeza de transações
    const handleTransactionsCleared = () => {
      setTransactions([]); // Limpa transações localmente
      fetchTransactions(); // E recarrega do servidor
    };

    // Escutar mudanças no localStorage (quando login/logout acontece)
    window.addEventListener('storage', fetchTransactions);
    // Escutar evento customizado de limpeza
    window.addEventListener('transactionsCleared', handleTransactionsCleared);

    // Listen for user data changes (transações, metas, etc)
    const handleUserDataChanged = (e: any) => {
      if (!e.detail || e.detail.userId === user?.id) {
        fetchTransactions();
      }
    };
    window.addEventListener('userDataChanged', handleUserDataChanged);

    return () => {
      window.removeEventListener('storage', fetchTransactions);
      window.removeEventListener('transactionsCleared', handleTransactionsCleared);
      window.removeEventListener('userDataChanged', handleUserDataChanged);
    };
  }, [currentUserId, fetchTransactions, user]);

  const addTransaction = useCallback(async (
    type: TransactionType,
    amount: number,
    date: Date,
    description?: string,
    attachmentFile?: File
  ) => {
    setLoading(true);
    try {
      if (!user) {
        throw new Error('Usuário não está logado');
      }
      const newTransaction = await TransactionService.addTransaction(
        user.id,
        type,
        amount,
        date,
        description,
        attachmentFile
      );
      setTransactions(prevTransactions => sortTransactions([ ...prevTransactions, newTransaction ]));
      return newTransaction;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add transaction');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateTransaction = useCallback(async (
    id: string,
    type: TransactionType,
    amount: number,
    date: Date,
    description?: string,
    attachmentFile?: File
  ) => {
    setLoading(true);
    try {
      const updatedTransaction = await TransactionService.updateTransaction(id, type, amount, date, description, attachmentFile);
      setTransactions(prevTransactions => {
        const oldTx = prevTransactions.find(t => t.id === id);
        if (oldTx && new Date(oldTx.date).getTime() !== new Date(date).getTime()) {
          return sortTransactions(prevTransactions.map(t => t.id === id ? updatedTransaction : t));
        } else {
          return prevTransactions.map(t => t.id === id ? updatedTransaction : t);
        }
      });
      return updatedTransaction;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update transaction');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const success = await TransactionService.deleteTransaction(id);

      if (success) {
        setTransactions(prevTransactions =>
          prevTransactions.filter(t => t.id !== id)
        );
      }

      return success;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete transaction');
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregamento inicial
  useEffect(() => {
    if (currentUserId === null && user) {
      setCurrentUserId(user.id);
      fetchTransactions();
    }
  }, [fetchTransactions, currentUserId, user]);

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    clearTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction
  };
}
