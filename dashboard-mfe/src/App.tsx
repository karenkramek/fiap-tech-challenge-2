import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import BalanceCard from 'shared/components/BalanceCard';
import StatementCard from 'shared/components/StatementCard';
import TransactionForm from 'shared/components/TransactionForm';
import { useAccount } from 'shared/hooks/useAccount';
import { useTransactions } from 'shared/hooks/useTransactions';
import { Transaction } from 'shared/models/Transaction';
import { TransactionType } from 'shared/types/TransactionType';
import { createCurrencyInputHandler, parseCurrencyStringToNumber } from 'shared/utils/currencyUtils';

type GroupedTransactions = {
  grouped: Record<string, Transaction[]>;
  sortedKeys: string[];
};

const Dashboard: React.FC = () => {
  // Estado para exibir ou esconder o saldo
  const [showBalance, setShowBalance] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

  // Handler reutilizável para campo de valor monetário
  const handleAmountChange = createCurrencyInputHandler(setAmount);

  const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.DEPOSIT);
  const [description, setDescription] = useState<string>("");
  const [formLoading, setFormLoading] = useState(false);

  const { account, loading: accountLoading, refreshAccount, currentUser } = useAccount();
  const { loading: transactionsLoading, addTransaction } = useTransactions();

  // Usar dados do usuário logado se disponível, senão usar account padrão
  const userDisplayName = currentUser?.name || account?.name;

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
        description,
        attachmentFile || undefined
      );

      // Atualiza saldo após nova transação
      try {
        await refreshAccount();
      } catch (refreshError) {
        console.error("Erro ao atualizar saldo da conta:", refreshError);
      }

      setAmount("");
      setDescription("");
      setAttachmentFile(null);
      toast.success("Transação adicionada com sucesso!");
    } catch (error) {
      toast.error("Erro ao adicionar transação.");
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleFileSelect = (file: File | null) => {
    setAttachmentFile(file);
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
        <div className="flex gap-6">
          {/* Conteúdo principal */}
          <div className="flex-1 space-y-6">
            {/* Saldo e transações recentes */}
            <BalanceCard
              accountName={userDisplayName}
              balance={account?.balance}
              showBalance={showBalance}
              onToggleBalance={() => setShowBalance((prev) => !prev)}
            />

            {/* Nova transação */}
            <TransactionForm
              amount={amount}
              transactionType={transactionType}
              description={description}
              attachmentFile={attachmentFile}
              onAmountChange={handleAmountChange}
              onTypeChange={(e) => setTransactionType(e.target.value as TransactionType)}
              onDescriptionChange={(e) => setDescription(e.target.value)}
              onFileSelect={setAttachmentFile}
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
