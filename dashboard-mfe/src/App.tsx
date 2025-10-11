import React, { Suspense, useState } from 'react';
import BalanceCard from 'shared/components/domain/BalanceCard';
import Card from 'shared/components/ui/Card';
import ErrorBoundary from 'shared/components/ui/ErrorBoundary';
import { showError, showSuccess } from 'shared/components/ui/FeedbackProvider';
import LoadingSpinner from 'shared/components/ui/LoadingSpinner';
import { TOAST_MESSAGES } from 'shared/constants/toast';
import { useTransactions } from 'shared/hooks/useTransactions';
import { useAccount } from 'shared/hooks/useAccount';
import { TransactionType } from 'shared/types/TransactionType';
import { createCurrencyInputHandler, parseCurrencyStringToNumber } from 'shared/utils/currency';
const TransactionList = React.lazy(() => import('shared/components/domain/transaction/TransactionList'));
const TransactionAdd = React.lazy(() => import('shared/components/domain/transaction/TransactionAdd'));

const Dashboard: React.FC = () => {
  const [showBalance, setShowBalance] = useState(false);
  const [amount, setAmount] = useState("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.DEPOSIT);
  const [description, setDescription] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const { transactions, loading: transactionsLoading, addTransaction, fetchTransactions } = useTransactions();
  const { loading: userLoading, account } = useAccount();

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
      showError(TOAST_MESSAGES.INVALID_AMOUNT);
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
      showSuccess(TOAST_MESSAGES.TRANSACTION_SUCCESS);
    } catch (error) {
      showError(TOAST_MESSAGES.TRANSACTION_ERROR);
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  if (transactionsLoading || formLoading || userLoading || !account) {
    return <LoadingSpinner size={48} />;
  }

  return (
    <>
      <div className="container mx-auto px-4 space-y-8">
        <div className="grid md:grid-cols-5 gap-6">
          {/* Conteúdo principal */}
          <main className="md:col-span-3 space-y-6">
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
          <aside className="sm:col-span-1 md:col-span-2 lg:col-span-2 space-y-6">
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
    </>
  );
};

export default Dashboard;
