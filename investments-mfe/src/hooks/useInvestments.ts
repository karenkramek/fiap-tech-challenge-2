import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from 'shared/store';

export const useInvestments = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [accountBalance, setAccountBalance] = useState<number | null>(null);

  const fetchInvestmentsAndTransactions = () => {
    if (!user?.id) return;
    setLoading(true);
    Promise.all([
      axios.get('http://localhost:3034/transactions'),
      axios.get(`http://localhost:3034/accounts?id=${user.id}`)
    ]).then(([txRes, accRes]) => {
      setTransactions(txRes.data);
      const account = accRes.data && accRes.data[0];
      setInvestments(account?.investments || []);
      setAccountBalance(account?.balance ?? null);
    }).finally(() => setLoading(false));
  };

  useEffect(fetchInvestmentsAndTransactions, [user?.id]);

  return {
    transactions,
    investments,
    loading,
    accountBalance,
    setAccountBalance,
    fetchInvestmentsAndTransactions
  };
};