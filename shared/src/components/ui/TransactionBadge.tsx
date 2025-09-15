import React from 'react';
import { TransactionType, getTransactionTypeLabel } from '@/models/Transaction';

interface TransactionBadgeProps {
  type: TransactionType;
}

const TransactionBadge = ({ type }: TransactionBadgeProps) => {
  const getTransactionTypeColor = (type: TransactionType) => {
    const colors: Record<TransactionType, string> = {
      [TransactionType.DEPOSIT]: 'bg-success-50 text-success-800 border-success-700',
      [TransactionType.WITHDRAWAL]: 'bg-error-50 text-error-800 border-error-700',
      [TransactionType.TRANSFER]: 'bg-info-50 text-info-800 border-info-700',
      [TransactionType.PAYMENT]: 'bg-warning-50 text-warning-800 border-warning-700'
    };
    return colors[type];
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getTransactionTypeColor(type)}`}>
      {getTransactionTypeLabel(type)}
    </span>
  );
};

export default TransactionBadge;
