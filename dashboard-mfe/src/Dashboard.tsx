import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import BalanceCard from './components/dashboard/BalanceCard';
import TransactionForm from './components/dashboard/TransactionForm';
import StatementCard from './components/dashboard/StatementCard';
import { useAccount } from './hooks/useAccount';
import { useTransactions } from './hooks/useTransactions';
import { Transaction, TransactionType } from './models/Transaction';
import { createCurrencyInputHandler, parseCurrencyStringToNumber } from './utils/currencyUtils';
import { getMonthKey } from './utils/utils';
import './dashboard-styles.css';

type GroupedTransactions = {
  grouped: Record<string, Transaction[]>;
  sortedKeys: string[];
};

const Dashboard: React.FC = () => {
  // Estado para exibir ou esconder o saldo
  const [showBalance, setShowBalance] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("");

  // Use the reusable currency input handler
  const handleAmountChange = createCurrencyInputHandler(setAmount);

  const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.DEPOSIT);
  const [description, setDescription] = useState<string>("");

  const { account, loading: accountLoading, refreshAccount } = useAccount();
  const { transactions, loading: transactionsLoading, addTransaction } = useTransactions();

  // Get the 5 most recent transactions.
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Helper function to group transactions by month.
  const groupTransactionsByMonth = (transactions: Transaction[]): GroupedTransactions => {
    const grouped: Record<string, Transaction[]> = {};

    // First group transactions by month.
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const monthKey = getMonthKey(date);

      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }

      grouped[monthKey].push(transaction);
    });

    // Then sort each group internally.
    Object.keys(grouped).forEach((key) => {
      grouped[key] = grouped[key].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });

    // Sort months (from newest to oldest).
    const sortedKeys = Object.keys(grouped).sort((a, b) => {
      const [monthA, yearA] = a.split("-").map(Number);
      const [monthB, yearB] = b.split("-").map(Number);

      if (yearA !== yearB) {
        return yearB - yearA;
      }

      return monthB - monthA;
    });

    return { grouped, sortedKeys };
  };

  // Group transactions by month.
  const { grouped, sortedKeys } = groupTransactionsByMonth(recentTransactions);

  // Logic to add a new transaction.
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    // Use the reusable parser
    const normalizedAmount = parseCurrencyStringToNumber(amount);

    if (!amount || isNaN(normalizedAmount) || normalizedAmount <= 0) {
      toast.error("Por favor, insira um valor válido.");
      return;
    }

    try {
      await addTransaction(
        transactionType,
        normalizedAmount,
        new Date(),
        description
      );

      // Refresh account balance after successful transaction
      try {
        await refreshAccount();
      } catch (refreshError) {
        console.error("Erro ao atualizar saldo da conta:", refreshError);
      }

      setAmount("");
      setDescription("");
      toast.success("Transação adicionada com sucesso!");
    } catch (error) {
      toast.error("Erro ao adicionar transação.");
      console.error(error);
    }
  };

  if (accountLoading || transactionsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <div className="grid md:grid-cols-5 gap-6">
          {/* Conteúdo principal */}
          <div className="md:col-span-3 space-y-6">
            {/* Saldo e transações recentes */}
            <BalanceCard
              accountName={account?.name}
              balance={account?.balance}
              showBalance={showBalance}
              onToggleBalance={() => setShowBalance((prev) => !prev)}
            />

            {/* Nova transação */}
            <TransactionForm
              amount={amount}
              transactionType={transactionType}
              description={description}
              onAmountChange={handleAmountChange}
              onTypeChange={(e) => setTransactionType(e.target.value as TransactionType)}
              onDescriptionChange={(e) => setDescription(e.target.value)}
              onSubmit={handleSubmit}
            />
          </div>

          {/* Extrato */}
          <StatementCard
            grouped={grouped}
            sortedKeys={sortedKeys}
            recentTransactions={recentTransactions}
          />
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default Dashboard;