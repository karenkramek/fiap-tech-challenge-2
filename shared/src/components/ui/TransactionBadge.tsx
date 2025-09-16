import React from 'react';
import { TransactionType, getTransactionTypeLabel } from '../../models/Transaction';

interface TransactionBadgeProps {
  type: TransactionType;
}


const TransactionBadge = ({ type }: TransactionBadgeProps) => {
  // Define cores usando variáveis CSS universais
  const getStyles = (type: TransactionType): React.CSSProperties => {
    switch (type) {
      case TransactionType.DEPOSIT:
        return {
          backgroundColor: 'var(--success-700)',
          color: 'var(--white-50)',
          border: '1px solid var(--success-700)'
        };
      case TransactionType.WITHDRAWAL:
        return {
          backgroundColor: 'var(--error-700)',
          color: 'var(--white-50)',
          border: '1px solid var(--error-700)'
        };
      case TransactionType.TRANSFER:
        return {
          backgroundColor: 'var(--primary-300)',
          color: 'var(--primary-700)',
          border: '1px solid var(--primary-700)'
        };
      case TransactionType.PAYMENT:
        return {
          backgroundColor: 'var(--secondary-700)',
          color: 'var(--white-50)',
          border: '1px solid var(--secondary-700)'
        };
      default:
        return {};
    }
  };

  return (
    <span
      style={getStyles(type)}
      className="inline-block px-3 py-1 rounded-full text-xs font-medium"
    >
      {getTransactionTypeLabel(type)}
    </span>
  );
};

export default TransactionBadge;
