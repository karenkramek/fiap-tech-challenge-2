import { getTransactionTypeLabel, TransactionType } from "../../../types/TransactionType";

// Componente de badge para exibir o tipo da transação
interface TransactionBadgeProps {
  type: TransactionType;
}

const TransactionBadge = ({ type }: TransactionBadgeProps) => {
  const getTransactionTypeColor = (type: TransactionType) => {
    const colors: Record<TransactionType, string> = {
      [TransactionType.DEPOSIT]: 'bg-success-50 text-success-800 border-success-700',
      [TransactionType.WITHDRAWAL]: 'bg-error-50 text-error-800 border-error-700',
      [TransactionType.TRANSFER]: 'bg-info-50 text-info-800 border-info-700',
      [TransactionType.PAYMENT]: 'bg-warning-50 text-warning-800 border-warning-700',
      [TransactionType.INVESTMENT]: 'bg-primary-50 text-primary-800 border-primary-700',
      [TransactionType.GOAL]: 'bg-purple-50 text-purple-800 border-purple-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-400';
  };

  return (
     <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs sm:text-xs font-medium border whitespace-nowrap ${getTransactionTypeColor(type)}`}>
       {getTransactionTypeLabel(type)}
    </span>
  );
};

export default TransactionBadge;
