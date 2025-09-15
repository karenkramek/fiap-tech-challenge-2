'use client';

import { useCallback, useEffect, useState } from 'react';
import { Transaction, TransactionType } from '../models/Transaction';
import { TransactionService } from '../services/TransactionService';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
      const data = await TransactionService.getAllTransactions();
      setTransactions(sortTransactions(data));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch transactions'));
    } finally {
      setLoading(false);
    }
  }, []);

  const addTransaction = useCallback(async (
    type: TransactionType,
    amount: number,
    date: Date,
    description?: string
  ) => {
    try {
      const newTransaction = await TransactionService.addTransaction(type, amount, date, description);
      setTransactions(prevTransactions => sortTransactions([ ...prevTransactions, newTransaction ]));
      return newTransaction;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add transaction');
    }
  }, []);

  const updateTransaction = useCallback(async (
    id: string,
    type: TransactionType,
    amount: number,
    date: Date,
    description?: string
  ) => {
    try {
      const updatedTransaction = await TransactionService.updateTransaction(id, type, amount, date, description);
      setTransactions(prevTransactions => {
        const oldTx = prevTransactions.find(t => t.id === id);
        // Se a data mudou, reordena; se não, só substitui mantendo a ordem
        if (oldTx && new Date(oldTx.date).getTime() !== new Date(date).getTime()) {
          return sortTransactions(prevTransactions.map(t => t.id === id ? updatedTransaction : t));
        } else {
          return prevTransactions.map(t => t.id === id ? updatedTransaction : t);
        }
      });
      return updatedTransaction;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update transaction');
    }
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    try {
      const success = await TransactionService.deleteTransaction(id);

      if (success) {
        // Remove the transaction from local state immediately.
        setTransactions(prevTransactions =>
          prevTransactions.filter(t => t.id !== id)
        );
      }

      return success;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete transaction');
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction
  };
}
