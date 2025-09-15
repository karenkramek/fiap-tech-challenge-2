import React, { useEffect, useState } from 'react';
import { transactionAPI, Transaction, Account } from './api';

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [transactionsData, accountData] = await Promise.all([
        transactionAPI.getTransactions(),
        transactionAPI.getAccount()
      ]);
      setTransactions(transactionsData);
      setAccount(accountData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await transactionAPI.deleteTransaction(id);
      await loadData(); // Reload to get fresh data
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getTransactionColor = (type: string): string => {
    switch (type) {
      case 'deposit': return 'text-green-600';
      case 'withdrawal': return 'text-red-600';
      case 'transfer': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getTransactionSign = (type: string): string => {
    return type === 'deposit' ? '+' : '-';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Carregando transações...</p>
      </div>
    );
  }

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Calculate totals
  const totalEntries = transactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExits = transactions
    .filter(t => t.type === 'withdrawal' || t.type === 'transfer')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Extrato</h1>
        <p className="text-gray-600">Gerencie suas transações financeiras</p>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Transações ({transactions.length})
          </h2>
          <button
            onClick={loadData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Atualizar
          </button>
        </div>

        {sortedTransactions.length > 0 ? (
          <div className="space-y-4">
            {sortedTransactions.map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    transaction.type === 'deposit' ? 'bg-green-500' :
                    transaction.type === 'withdrawal' ? 'bg-red-500' : 'bg-blue-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{transaction.type}</p>
                    <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                    {transaction.description && (
                      <p className="text-sm text-gray-600">{transaction.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                    {getTransactionSign(transaction.type)}{formatCurrency(transaction.amount)}
                  </span>
                  <button
                    onClick={() => handleDeleteTransaction(transaction.id)}
                    className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma transação encontrada</h3>
            <p className="text-gray-500 mb-6">Adicione transações na página Dashboard</p>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total de Entradas</h3>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalEntries)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total de Saídas</h3>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExits)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Saldo Atual</h3>
          <p className="text-2xl font-bold text-blue-600">
            {account ? formatCurrency(account.balance) : 'Carregando...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Transactions;