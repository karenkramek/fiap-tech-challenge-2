import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'shared/store';
import { AccountService } from 'shared/services/AccountService';
import { TransactionService } from 'shared/services/TransactionService';
import { InvestmentService } from 'shared/services/InvestmentService';
import { Transaction } from 'shared/models/Transaction';
import type { InvestmentDTO } from 'shared/dtos/Investment.dto';

export const useInvestments = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [investments, setInvestments] = useState<InvestmentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [accountBalance, setAccountBalance] = useState<number | null>(null);

  const fetchInvestmentsAndTransactions = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      // Busca transações, investimentos globais e conta
      const [transactionsList, investmentsList, account] = await Promise.all([
        TransactionService.getAllTransactions(user.id),
        InvestmentService.getAll(user.id),
        AccountService.getAccountById(user.id)
      ]);
      setTransactions(transactionsList);
      setInvestments(investmentsList);
      setAccountBalance(account?.balance ?? null);
    } catch (error) {
      setTransactions([]);
      setInvestments([]);
      setAccountBalance(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInvestmentsAndTransactions(); }, [user?.id]);

  return {
    transactions,
    investments,
    loading,
    accountBalance,
    setAccountBalance,
    fetchInvestmentsAndTransactions
  };
};