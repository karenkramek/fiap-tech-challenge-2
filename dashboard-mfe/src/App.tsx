import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import BalanceCard from 'shared/components/domain/BalanceCard';
import Card from 'shared/components/ui/Card';
import TransactionList from 'shared/components/domain/transaction/TransactionList';
import TransactionAdd from 'shared/components/domain/transaction/TransactionAdd';
import { useTransactions } from 'shared/hooks/useTransactions';
import { TransactionType } from 'shared/types/TransactionType';
import { createCurrencyInputHandler, parseCurrencyStringToNumber } from 'shared/utils/currencyUtils';

const TRANSACTION_SUCCESS_MSG = 'Transação adicionada com sucesso!';
const TRANSACTION_ERROR_MSG = 'Erro ao adicionar transação.';
const INVALID_AMOUNT_MSG = 'Por favor, insira um valor válido.';
const LOADING_MSG = 'Carregando...';

const Dashboard: React.FC = () => {
  const [showBalance, setShowBalance] = useState(false);
  const [amount, setAmount] = useState("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.DEPOSIT);
  const [description, setDescription] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const handleAmountChange = createCurrencyInputHandler(setAmount);

  const { transactions, loading: transactionsLoading, addTransaction, fetchTransactions } = useTransactions();

  // Atualiza transações após editar/excluir
  const handleTransactionsChanged = async () => {
    await fetchTransactions();
  };

  const handleAddTransaction = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setFormLoading(true);
    const normalizedAmount = parseCurrencyStringToNumber(amount);
    if (!amount || isNaN(normalizedAmount) || normalizedAmount <= 0) {
      toast.error(INVALID_AMOUNT_MSG);
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
      setAmount("");
      setDescription("");
      setAttachmentFile(null);
      toast.success(TRANSACTION_SUCCESS_MSG);
    } catch (error) {
      toast.error(TRANSACTION_ERROR_MSG);
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  if (transactionsLoading || formLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>{LOADING_MSG}</p>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 space-y-8">
        <div className="flex gap-6">
          {/* Conteúdo principal */}
          <main className="flex-1 space-y-6">

            {/* Saldo */}
            <BalanceCard
              transactions={transactions}
              showBalance={showBalance}
              onToggleBalance={() => setShowBalance((prev) => !prev)}
            />

            {/* Nova Transação */}
            <Card className="bg-white-50 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-primary-700 mb-5">Nova transação</h2>
              <TransactionAdd
                amount={amount}
                transactionType={transactionType}
                description={description}
                attachmentFile={attachmentFile}
                onAmountChange={handleAmountChange}
                onTypeChange={(e) => setTransactionType(e.target.value as TransactionType)}
                onDescriptionChange={(e) => setDescription(e.target.value)}
                onFileSelect={setAttachmentFile}
                onSubmit={handleAddTransaction}
                loading={formLoading}
              />
            </Card>
          </main>

          {/* Extrato */}
          <aside className="w-80 space-y-6">
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h2 className="transactions-title text-primary-700">Extrato</h2>
              </div>
              <TransactionList
                transactions={transactions}
                onTransactionsChanged={handleTransactionsChanged}
                mode="dashboard"
              />
            </Card>
          </aside>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default Dashboard;