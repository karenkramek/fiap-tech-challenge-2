import React, { useState, useEffect, useRef } from "react";
import Button from "shared/components/ui/Button";
import Card from "shared/components/ui/Card";
import TransactionList from "shared/components/domain/transaction/TransactionList";
import TransactionAdd from "shared/components/domain/transaction/TransactionAdd";
import { TransactionType } from "shared/types/TransactionType";
import { createCurrencyInputHandler, parseCurrencyStringToNumber } from "shared/utils/currency";
import { useTransactions } from "shared/hooks/useTransactions";
import ModalWrapper from "shared/components/ui/ModalWrapper";
import { Search } from "lucide-react";
import FeedbackProvider from "shared/components/ui/FeedbackProvider";
import ErrorBoundary from "shared/components/ui/ErrorBoundary";

const TransactionsPage: React.FC = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.DEPOSIT);
  const [description, setDescription] = useState("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState("");
  const lastSearchRef = useRef("");

  const { transactions, addTransaction, fetchTransactions } = useTransactions();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (search !== lastSearchRef.current) {
        lastSearchRef.current = search;
        fetchTransactions();
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [search, fetchTransactions]);

  const handleAmountChange = createCurrencyInputHandler(setAmount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const numericAmount = parseCurrencyStringToNumber(amount);
      if (numericAmount <= 0) {
        setFormLoading(false);
        return;
      }
      await addTransaction(
        transactionType,
        numericAmount,
        new Date(),
        description,
        attachmentFile || undefined
      );
      setAmount("");
      setDescription("");
      setAttachmentFile(null);
      setTransactionType(TransactionType.DEPOSIT);
      setAddModalOpen(false);
      await fetchTransactions();
    } catch (error) {
      console.error("Erro ao criar transação:", error);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <>
      <FeedbackProvider />
      {/* Extrato */}
      <Card>
        <div className="min-h-screen" role="main" aria-label="Extrato de transações">
          <div className="flex justify-between items-center mb-6">
            <h2 className="transactions-title text-primary-700">Extrato</h2>
            <Button 
              onClick={() => setAddModalOpen(true)}
              className="inline-block bg-primary-700 text-white-50 px-4 py-2 rounded hover:bg-primary-600 transition-colors text-sm font-medium"
              aria-label="Adicionar nova transação"
            >
              Nova Transação
            </Button>
          </div>

          <ErrorBoundary>
            {/* Input de busca */}
            <div className="flex items-center gap-2 mb-6 bg-white-50 rounded-xl border border-gray-700 px-3 py-2 focus-within:ring-2 focus-within:ring-primary-500" role="search" aria-label="Buscar transações">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar"
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 focus:outline-none"
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Buscar transações"
              />
            </div>
            <TransactionList
              transactions={transactions} // Passe todas as transações!
              onTransactionsChanged={fetchTransactions}
              mode="full"
              search={search}
              totalTransactions={transactions.length}
            />
          </ErrorBoundary>
        </div>
      </Card>
      {addModalOpen && (
        <ModalWrapper open={addModalOpen} onClose={() => setAddModalOpen(false)} title="Nova Transação" size="md">
          <ErrorBoundary>
            <TransactionAdd
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
              onClose={() => setAddModalOpen(false)}
            />
          </ErrorBoundary>
        </ModalWrapper>
      )}
    </>
  );
};

export default TransactionsPage;
