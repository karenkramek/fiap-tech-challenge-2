import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { useTransactions } from 'shared/hooks/useTransactions';
import { Transaction } from 'shared/models/Transaction';
import { TransactionType } from 'shared/types/TransactionType';
import { createCurrencyInputHandler, parseCurrencyStringToNumber } from 'shared/utils/currencyUtils';
import { useAccount } from 'shared/hooks/useAccount';
import BalanceCard from 'shared/components/BalanceCard';
import TransactionForm from 'shared/components/TransactionForm';
import StatementCard from 'shared/components/StatementCard';

type GroupedTransactions = {
  grouped: Record<string, Transaction[]>;
  sortedKeys: string[];
};

const Dashboard: React.FC = () => {
  // Estado para exibir ou esconder o saldo
  const [showBalance, setShowBalance] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("");

  // Handler reutilizável para campo de valor monetário
  const handleAmountChange = createCurrencyInputHandler(setAmount);

  const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.DEPOSIT);
  const [description, setDescription] = useState<string>("");
  const [formLoading, setFormLoading] = useState(false);

  const { account, loading: accountLoading, refreshAccount } = useAccount();
  const { loading: transactionsLoading, addTransaction } = useTransactions();

  // Logic to add a new transaction.
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setFormLoading(true);

    const normalizedAmount = parseCurrencyStringToNumber(amount);

    if (!amount || isNaN(normalizedAmount) || normalizedAmount <= 0) {
      toast.error("Por favor, insira um valor válido.");
      setFormLoading(false);
      return;
    }

    try {
      await addTransaction(
        transactionType,
        normalizedAmount,
        new Date(),
        description
      );

      // Atualiza saldo após nova transação
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
    } finally {
      setFormLoading(false);
    }
  };

  if (accountLoading || transactionsLoading || formLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 space-y-8">
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
              loading={formLoading}
            />
          </div>
          
          {/* Extrato */}
          <StatementCard />
        </div>
      </div>
      
      <Toaster />
    </>
  );
};

export default Dashboard;