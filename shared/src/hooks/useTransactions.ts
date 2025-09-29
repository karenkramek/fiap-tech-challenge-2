'use client';

import { useCallback, useEffect, useState } from 'react';
import { Transaction } from '../models/Transaction';
import { AccountService } from '../services/AccountService';
import { TransactionService } from '../services/TransactionService';
import { TransactionType } from '../types/TransactionType';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

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

      // Obter o usuário atual para filtrar transações
      const currentUser = AccountService.getCurrentUser();
      if (!currentUser) {
        // Se não há usuário logado, não carregar transações
        setTransactions([]);
        setError(null);
        return;
      }

      // Buscar apenas transações do usuário atual
      const data = await TransactionService.getAllTransactions(currentUser.id);
      setTransactions(sortTransactions(data));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch transactions'));
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para limpar transações localmente (usada após criar conta)
  const clearTransactions = useCallback(() => {
    setTransactions([]);
  }, []);

  // Detectar mudança de usuário e recarregar transações
  useEffect(() => {
    const checkUserChange = () => {
      const currentUser = AccountService.getCurrentUser();
      const newUserId = currentUser?.id || null;

      if (newUserId !== currentUserId) {
        setCurrentUserId(newUserId);
        fetchTransactions(); // Recarrega transações quando usuário muda
      }
    };

    // Escutar evento customizado de limpeza de transações
    const handleTransactionsCleared = () => {
      console.log('Evento de limpeza de transações recebido');
      setTransactions([]); // Limpa transações localmente
      fetchTransactions(); // E recarrega do servidor
    };

    checkUserChange();

    // Escutar mudanças no localStorage (quando login/logout acontece)
    window.addEventListener('storage', checkUserChange);
    // Escutar evento customizado de limpeza
    window.addEventListener('transactionsCleared', handleTransactionsCleared);

    // Também escutar mudanças locais no localStorage
    const interval = setInterval(checkUserChange, 1000);

    return () => {
      window.removeEventListener('storage', checkUserChange);
      window.removeEventListener('transactionsCleared', handleTransactionsCleared);
      clearInterval(interval);
    };
  }, [currentUserId, fetchTransactions]);

  const addTransaction = useCallback(async (
    type: TransactionType,
    amount: number,
    date: Date,
    description?: string,
    attachmentFile?: File
  ) => {
    setLoading(true);
    try {
      const currentUser = AccountService.getCurrentUser();
      if (!currentUser) {
        throw new Error('Usuário não está logado');
      }

      const newTransaction = await TransactionService.addTransaction(
        currentUser.id,
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
  }, []);

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
    if (currentUserId === null) {
      // Primeira execução, definir usuário atual e carregar
      const currentUser = AccountService.getCurrentUser();
      setCurrentUserId(currentUser?.id || 'anonymous');
      fetchTransactions();
    }
  }, [fetchTransactions, currentUserId]);

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
