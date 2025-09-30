import React, { Suspense, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import BalanceCard from 'shared/components/domain/BalanceCard';
import Card from 'shared/components/ui/Card';
const TransactionList = React.lazy(() => import('shared/components/domain/transaction/TransactionList'));
const TransactionAdd = React.lazy(() => import('shared/components/domain/transaction/TransactionAdd'));
import { useTransactions } from 'shared/hooks/useTransactions';
import { TransactionType } from 'shared/types/TransactionType';
import { createCurrencyInputHandler, parseCurrencyStringToNumber } from 'shared/utils/currency';
import FeedbackProvider from 'shared/components/ui/FeedbackProvider';
import LoadingSpinner from 'shared/components/ui/LoadingSpinner';
import ErrorBoundary from 'shared/components/ui/ErrorBoundary';

const TRANSACTION_SUCCESS_MSG = 'Transação adicionada com sucesso!';
const TRANSACTION_ERROR_MSG = 'Erro ao adicionar transação.';
const INVALID_AMOUNT_MSG = 'Por favor, insira um valor válido.';

const Dashboard: React.FC = () => {
  const [showBalance, setShowBalance] = useState(false);
  const [amount, setAmount] = useState("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.DEPOSIT);
  const [description, setDescription] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const { transactions, loading: transactionsLoading, addTransaction, fetchTransactions } = useTransactions();

  const handleAmountChange = createCurrencyInputHandler(setAmount);

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
    return <LoadingSpinner size={48} />;
  }

  return (
    <>
      <FeedbackProvider />
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
              <ErrorBoundary fallback={<div>Erro ao carregar componente!</div>}>
                <Suspense fallback={<LoadingSpinner size={32} />}>
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
                </Suspense>
              </ErrorBoundary>
            </Card>
          </main>
          {/* Extrato */}
          <aside className="w-80">
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h2 className="transactions-title text-primary-700">Extrato</h2>
              </div>
              <ErrorBoundary fallback={<div>Erro ao carregar lista!</div>}>
                <Suspense fallback={<LoadingSpinner size={32} />}>
                  <TransactionList
                    transactions={transactions}
                    onTransactionsChanged={handleTransactionsChanged}
                    mode="dashboard"
                  />
                  <div className="w-full flex justify-center mt-4">
                    <a
                      href="/transactions"
                      className="inline-block bg-primary-700 text-white-50 px-4 py-2 rounded hover:bg-primary-600 transition-colors text-sm font-medium text-center"
                    >
                      Ver Transações
                    </a>
                  </div>
                </Suspense>
              </ErrorBoundary>
            </Card>
          </aside>
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  );
};

export default Dashboard;