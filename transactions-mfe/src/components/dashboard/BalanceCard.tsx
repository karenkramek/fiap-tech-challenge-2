import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { getCurrentDateFormatted } from '@/utils/utils';
import { formatCurrencyWithSymbol } from '@/utils/currencyUtils';

interface BalanceCardProps {
  accountName?: string;
  balance?: number;
  showBalance: boolean;
  onToggleBalance: () => void;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ accountName, balance = 0, showBalance, onToggleBalance }) => (
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

export default BalanceCard;