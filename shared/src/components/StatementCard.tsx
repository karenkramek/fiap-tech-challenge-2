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

// Componente para ações de transação
const TransactionActions: React.FC<{
  onEdit: () => void;
  onDelete: () => void;
  loading?: boolean;
}> = React.memo(({ onEdit, onDelete, loading }) => (
  <div className="flex items-center gap-2">
    <button
      className="p-1 hover:bg-primary-50 rounded"
      title="Editar"
      aria-label="Editar transação"
      onClick={onEdit}
      disabled={loading}
    >
      <Edit className={`h-5 w-5 text-white-800 hover:text-primary-700 cursor-pointer ${loading ? 'opacity-50' : ''}`} />
    </button>
    <button
      className="p-1 hover:bg-error-50 rounded"
      title="Excluir"
      aria-label="Excluir transação"
      onClick={onDelete}
      disabled={loading}
    >
      <Trash2 className={`h-5 w-5 text-white-800 hover:text-error-700 cursor-pointer ${loading ? 'opacity-50' : ''}`} />
    </button>
  </div>
));

// Componente para detalhes da transação
const TransactionDetails: React.FC<{
  description: string;
  attachmentPath?: string;
  transactionType: TransactionType;
  showLabel: boolean;
}> = React.memo(({ description, attachmentPath, transactionType, showLabel }) => (
  <div className="flex flex-col flex-1 justify-center">
    <p className="text-gray-700 text-sm mb-0 truncate">{description || "Sem descrição"}</p>
    {attachmentPath ? (
      <div className="mt-1">
        <AttachmentDisplay
          attachmentPath={attachmentPath}
          transactionType={transactionType}
          showLabel={showLabel}
          className="text-xs"
        />
      </div>
    ) : null}
  </div>
));

// Componente para item de transação
const TransactionItem: React.FC<{
  transaction: any;
  mode: 'dashboard' | 'full';
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}> = React.memo(({ transaction, mode, onEdit, onDelete, loading }) => {
  return (
    <div className={`flex flex-col border-b py-2 ${mode === 'full' ? 'px-2' : ''}`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <TransactionBadge type={transaction.type} />
          <span className="text-sm text-gray-500">{formatDate(transaction.date)}</span>
        </div>
        <TransactionActions
          onEdit={() => onEdit(transaction.id)}
          onDelete={() => onDelete(transaction.id)}
          loading={loading}
        />
      </div>
      <div className="flex items-stretch mb-2 p-1">
        <TransactionDetails
          description={transaction.description}
          attachmentPath={transaction.attachmentPath}
          transactionType={transaction.type}
          showLabel={mode === 'full'}
        />
        <div className="flex items-center ml-4 min-h-[40px]">
          <span className={`text-lg font-semibold ${transaction.isIncome() ? 'text-green-600' : 'text-red-600'}`}>{transaction.isIncome() ? '' : '-'} {formatCurrencyWithSymbol(transaction.amount)}</span>
        </div>
      </div>
    </div>
  );
});

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
  const monthTitleClass = [mode === 'full' ? 'text-lg' : '', 'font-semibold', 'text-gray-600', 'border-b', 'border-gray-200', 'pb-2'].join(' ');

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
        {/* Campo de busca */}
        {/* <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Buscar por descrição, valor, tipo ou data..."
            value={search}
            onChange={e => mode === 'full' ? onSearchChange(e.target.value) : undefined}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-200 text-sm text-gray-700 bg-white-50"
            style={{ minWidth: 0 }}
            disabled={mode !== 'full'}
          />
        </div> */}
        {transactions.length > 0 ? (
          <div>
            {sortedKeys.map((key, idx) => {
              const [month, year] = key.split("-");
              const isLast = idx === sortedKeys.length - 1;
              return (
                <div key={key} className={isLast ? "mb-0" : "mb-6"}>
                  <h3 className={monthTitleClass}>
                    {getMonthName(month)} {year}
                  </h3>
                  <div className="space-y-2 mt-1">
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
            {/* <div ref={listEndRef} />
            {loading && <div className="text-center py-2">Carregando mais...</div>} */}
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
