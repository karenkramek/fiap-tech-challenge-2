// Componente de cartão de saldo, exibe o nome do usuário e saldo da conta
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { getCurrentDateFormatted } from '../../utils/utils';
import { formatCurrencyWithSymbol } from '../../utils/currencyUtils';
import { Transaction } from '../../models/Transaction';
import { TransactionType } from '../../types/TransactionType';
import { useAccount } from '../../hooks/useAccount';

interface BalanceCardProps {
  transactions: Transaction[];
  showBalance: boolean;
  onToggleBalance: () => void;
}

function calculateBalance(transactions: Transaction[]) {
  return transactions.reduce((acc, tx) => {
    switch (tx.type) {
      case TransactionType.DEPOSIT:
        return acc + tx.amount;
      case TransactionType.WITHDRAWAL:
      case TransactionType.PAYMENT:
      case TransactionType.TRANSFER:
        return acc - tx.amount;
      default:
        return acc;
    }
  }, 0);
}

const BalanceCard: React.FC<BalanceCardProps> = ({ transactions, showBalance, onToggleBalance }) => {
  const { account, currentUser } = useAccount();
  const accountName = currentUser?.name || account?.name || '';
  const balance = calculateBalance(transactions);
  return (
    <div className='balance-card'>
      <div className='space-y-4'>
        <div>
          <h1 className='balance-title'>
            Olá, {accountName ? accountName.split(' ')[0] : 'Usuário'}! :)
          </h1>
          <p className='balance-subtitle'>{getCurrentDateFormatted()}</p>
        </div>
        <div>
          <div className='flex items-center'>
            <h2 className='balance-section-title'>Saldo</h2>
            <button
              type='button'
              aria-label={showBalance ? 'Esconder saldo' : 'Exibir saldo'}
              className='ml-3 p-1 rounded bg-transparent focus:outline-none'
              onClick={onToggleBalance}
            >
              {showBalance ? (
                <Eye className='w-6 h-6 text-warning-800' />
              ) : (
                <EyeOff className='w-6 h-6 text-warning-800' />
              )}
            </button>
          </div>
          <div className='balance-card-divider'></div>
          <p className='balance-account-label'>Conta Corrente</p>
          <p className='balance-amount'>
            {showBalance ? formatCurrencyWithSymbol(balance) : 'R$ ---'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;