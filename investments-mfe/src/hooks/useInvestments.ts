import { useState, useEffect } from 'react';
import axios from 'axios';

const accountId = 'acc001';

export const useInvestments = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [accountBalance, setAccountBalance] = useState<number | null>(null);

  const fetchInvestmentsAndTransactions = () => {
    setLoading(true);
    Promise.all([
      axios.get('http://localhost:3034/transactions'),
      axios.get(`http://localhost:3034/accounts?id=${accountId}`)
    ]).then(([txRes, accRes]) => {
      setTransactions(txRes.data);
      const account = accRes.data && accRes.data[0];
      setInvestments(account?.investments || []);
      setAccountBalance(account?.balance ?? null);
    }).finally(() => setLoading(false));
  };

  useEffect(fetchInvestmentsAndTransactions, []);

  return {
    transactions,
    investments,
    loading,
    accountBalance,
    setAccountBalance,
    fetchInvestmentsAndTransactions
  };
};