import React from 'react';
import { BanknoteArrowDown, BanknoteArrowUp, Edit, Trash2 } from 'lucide-react';
import { TransactionType } from '../types/TransactionType';

export function TransactionTypeIcon({ type, className = '' }: { type: TransactionType, className?: string }) {
  if (type === TransactionType.DEPOSIT || type === TransactionType.TRANSFER) {
    return <BanknoteArrowDown className={className} />;
  }
  return <BanknoteArrowUp className={className} />;
}

export { Edit, Trash2 };
