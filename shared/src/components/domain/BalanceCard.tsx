// Componente de cartão de saldo, exibe o nome do usuário e saldo da conta
import React, { useEffect, useRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { getCurrentDateFormatted } from '../../utils/date';
import { formatCurrencyWithSymbol } from '../../utils/currency';
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
  
  const announceRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (announceRef.current) {
      if (showBalance) {
        announceRef.current.textContent = `Saldo atual: ${formatCurrencyWithSymbol(balance)}`;
      } else {
        announceRef.current.textContent = 'Saldo ocultado';
      }
    }
  }, [showBalance, balance]);

  return (
    <div className='balance-card'>
      <div
        ref={announceRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      ></div>
      
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
              className='ml-3 p-1 rounded bg-transparent outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-warning-500'
              onClick={onToggleBalance}
            >
              {showBalance ? (
                <Eye 
                  className='w-6 h-6 text-warning-800' 
                  aria-hidden="true" 
                />
              ) : (
                <EyeOff 
                  className='w-6 h-6 text-warning-800' 
                  aria-hidden="true"
                />
              )}
            </button>
          </div>
          <div className='balance-card-divider'></div>
          <p className='balance-account-label'>Conta Corrente</p>
          <p 
            className='balance-amount'
            aria-hidden={!showBalance}
          >
            {showBalance ? formatCurrencyWithSymbol(balance) : 'R$ ---'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;