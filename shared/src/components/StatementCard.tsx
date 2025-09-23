import { Edit, Trash2 } from 'lucide-react';
import React, { useState } from "react";
import { useGroupedTransactions } from "../hooks/useGroupedTransactions";
import { useModal } from '../hooks/useModal';
import { useTransactions } from '../hooks/useTransactions';
import { formatCurrencyWithSymbol } from '../utils/currencyUtils';
import { formatDate, getMonthName } from '../utils/utils';
import AttachmentDisplay from './AttachmentDisplay';
import Card from './Card';
import ConfirmationModal from './ConfirmationModal';
import EditTransactionModal from './EditTransactionModal';
import TransactionBadge from './TransactionBadge';
import Button from './Button';
import { TransactionType } from '../types/TransactionType';
import { createCurrencyInputHandler, parseCurrencyStringToNumber } from '../utils/currencyUtils';
import TransactionForm from './TransactionForm';

interface StatementCardProps {
  mode?: 'dashboard' | 'full';
}

const StatementCard: React.FC<StatementCardProps> = ({ mode = 'dashboard' }) => {
  const { transactions, deleteTransaction, fetchTransactions, addTransaction } = useTransactions();
  const { grouped, sortedKeys } = useGroupedTransactions(transactions);
  const editModal = useModal();
  const deleteModal = useModal();
  const [transactionToEdit, setTransactionToEdit] = useState<string | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Estados do formulário de nova transação
  const [amount, setAmount] = useState<string>("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.DEPOSIT);
  const [description, setDescription] = useState<string>("");
  const [formLoading, setFormLoading] = useState(false);

  const handleAmountChange = createCurrencyInputHandler(setAmount);

  const openEditModal = (id: string) => {
    setTransactionToEdit(id);
    editModal.openModal();
  };
  const closeEditModal = () => {
    editModal.closeModal();
    setTransactionToEdit(null);
  };
  const openDeleteModal = (id: string) => {
    setTransactionToDelete(id);
    deleteModal.openModal();
  };
  const closeDeleteModal = () => {
    deleteModal.closeModal();
    setTransactionToDelete(null);
  };
  const closeAddModal = () => setAddModalOpen(false);

  const handleDelete = async () => {
    if (transactionToDelete) {
      try {
        await deleteTransaction(transactionToDelete);
        closeDeleteModal();
        await fetchTransactions();
      } catch (error) {
        if (typeof window !== "undefined") {
          console.error("Erro ao excluir transação.");
        }
        console.error(error);
      }
    }
  };

  const handleEditSuccess = () => {
    fetchTransactions();
    closeEditModal();
  };

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

  // Classes e elementos dinâmicos
  const containerClass = mode === 'full' ? 'space-y-6' : 'w-80 space-y-6';
  const cardTitleClass = 'flex justify-between items-center mb-6';
  const monthTitleClass = 'text-lg font-semibold text-gray-600 border-b border-gray-200 pb-2';

  // Componente para item de transação
  const TransactionItem: React.FC<{
    transaction: any;
    mode: 'dashboard' | 'full';
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    loading?: boolean;
  }> = ({ transaction, mode, onEdit, onDelete, loading }) => (
    <div className="bg-white border-b-4 border-gray-200 p-4 shadow-sm rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <TransactionBadge type={transaction.type} />
          <span className="text-sm text-gray-500">{formatDate(transaction.date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-1 hover:bg-primary-50 rounded"
            title="Editar"
            aria-label="Editar transação"
            onClick={() => onEdit(transaction.id)}
            disabled={loading}
          >
            <Edit className={`h-5 w-5 text-white-800 hover:text-primary-700 cursor-pointer ${loading ? 'opacity-50' : ''}`} />
          </button>
          <button
            className="p-1 hover:bg-error-50 rounded"
            title="Excluir"
            aria-label="Excluir transação"
            onClick={() => onDelete(transaction.id)}
            disabled={loading}
          >
            <Trash2 className={`h-5 w-5 text-white-800 hover:text-error-700 cursor-pointer ${loading ? 'opacity-50' : ''}`} />
          </button>
        </div>
      </div>
      <div className="flex items-center min-h-[40px]">
        <p className="text-gray-700 text-sm mb-0 flex-1 truncate">
          {transaction.description || "Sem descrição"}
        </p>
        <span className={`text-lg font-semibold ml-4 ${transaction.isIncome() ? 'text-green-600' : 'text-red-600'}`}>
          {transaction.isIncome() ? '' : '-'} {formatCurrencyWithSymbol(transaction.amount)}
        </span>
      </div>
      <div className="flex items-center min-h-[32px]">
        {transaction.attachmentPath ? (
          <div className="mt-2 flex-1">
            <AttachmentDisplay
              attachmentPath={transaction.attachmentPath}
              transactionType={transaction.type}
              showLabel={mode === 'full'}
              className="text-xs"
            />
          </div>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  );

  return (
    <div className={containerClass}>
      <Card>
        <div className={cardTitleClass}>
          <h2 className="transactions-title text-primary-700">Extrato</h2>
          {mode === 'full' && (
            <Button variant="primary" onClick={() => setAddModalOpen(true)}>
              Nova Transação
            </Button>
          )}
        </div>
        {transactions.length > 0 ? (
          <div>
            {sortedKeys.map((key) => {
              const [month, year] = key.split("-");
              return (
                <div key={key} className="mb-6">
                  <h3 className={monthTitleClass}>
                    {getMonthName(month)} {year}
                  </h3>
                  <div className="space-y-2">
                    {grouped[key].map((transaction) => (
                      <TransactionItem
                        key={transaction.id}
                        transaction={transaction}
                        mode={mode}
                        onEdit={openEditModal}
                        onDelete={openDeleteModal}
                        loading={formLoading}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-white-800">Nenhuma transação registrada.</p>
        )}
      </Card>

      {/* Modais */}
      <EditTransactionModal
        open={editModal.open}
        onClose={closeEditModal}
        transactionId={transactionToEdit}
        onSuccess={handleEditSuccess}
      />
      <ConfirmationModal
        open={deleteModal.open}
        title="Confirmar exclusão"
        description="Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
        loading={false}
      />
      {mode === 'full' && addModalOpen && (
        <div className="fixed inset-0 !m-0 modal-overlay flex items-center justify-center z-50">
          <div className="modal-content relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none z-10"
              onClick={closeAddModal}
              aria-label="Fechar"
            >
              ×
            </button>
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
        </div>
      )}
    </div>
  );
};

export default StatementCard;
