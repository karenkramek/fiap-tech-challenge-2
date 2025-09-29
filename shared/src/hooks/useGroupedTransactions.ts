import { useMemo } from 'react';
import { Transaction } from '../models/Transaction';
import { getMonthKey } from '../utils/date';

export function useGroupedTransactions(transactions: Transaction[]) {
  return useMemo(() => {
    const grouped: Record<string, Transaction[]> = {};
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const monthKey = getMonthKey(date);
      if (!grouped[monthKey]) grouped[monthKey] = [];
      grouped[monthKey].push(transaction);
    });
    Object.keys(grouped).forEach((key) => {
      grouped[key] = grouped[key].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
    const sortedKeys = Object.keys(grouped).sort((a, b) => {
      const [monthA, yearA] = a.split("-").map(Number);
      const [monthB, yearB] = b.split("-").map(Number);
      if (yearA !== yearB) return yearB - yearA;
      return monthB - monthA;
    });
    return { grouped, sortedKeys };
  }, [transactions]);
}
