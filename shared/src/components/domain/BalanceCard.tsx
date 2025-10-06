// Componente de cartão de saldo, exibe o nome do usuário e saldo da conta
import React, { useEffect, useState } from 'react';
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
  const { account, currentUser, refreshAccount } = useAccount();
  const [realBalance, setRealBalance] = useState<number>(0);
  
  const accountName = currentUser?.name || account?.name || '';
  
  // Buscar saldo real da API
  const fetchRealBalance = async () => {
    try {
      const accountId = account?.id || currentUser?.id || '1';
      
      const response = await fetch(`http://localhost:3034/accounts/${accountId}`);
      if (!response.ok) {
        // Fallback: usar saldo do Redux ou calculado das transações
        setRealBalance(account?.balance || currentUser?.balance || calculateBalance(transactions));
        return;
      }
      
      const accountData = await response.json();
      setRealBalance(accountData.balance);
      
    } catch (error) {
      // Fallback: usar saldo do Redux ou calculado das transações
      setRealBalance(account?.balance || currentUser?.balance || calculateBalance(transactions));
    }
  };

  // Buscar saldo real quando componente monta ou conta muda
  useEffect(() => {
    fetchRealBalance();
  }, [account?.id, currentUser?.id]);

  // Buscar saldo real quando transações mudam
  useEffect(() => {
    fetchRealBalance();
  }, [transactions.length]);

  // Escutar eventos de atualização de saldo
  useEffect(() => {
    const handleBalanceUpdate = () => {
      fetchRealBalance();
      if (refreshAccount) {
        refreshAccount();
      }
    };

    window.addEventListener('balanceUpdated', handleBalanceUpdate);
    
    return () => window.removeEventListener('balanceUpdated', handleBalanceUpdate);
  }, [refreshAccount]);

  // Atualizar saldo a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      fetchRealBalance();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Usar saldo real da conta corrente
  const displayBalance = realBalance;

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
            {showBalance ? formatCurrencyWithSymbol(displayBalance) : 'R$ ---'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;