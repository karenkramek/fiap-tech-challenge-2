import { Edit, Trash2 } from 'lucide-react';
import React, { useState } from "react";
import { useGroupedTransactions } from "../../../hooks/useGroupedTransactions";
import { useModal } from '../../../hooks/useModal';
import { useTransactions } from '../../../hooks/useTransactions';
import { formatCurrencyWithSymbol } from '../../../utils/currencyUtils';
import { formatDate, getMonthName } from '../../../utils/utils';
import AttachmentDisplay from '../file/AttachmentDisplay';
import ConfirmationModal from '../../ui/ConfirmationModal';
import TransactionEdit from './TransactionEdit';
import TransactionTypeBadge from './TransactionTypeBadge';
import { TransactionType } from '../../../types/TransactionType';
import ModalWrapper from '../../ui/ModalWrapper';
import { Transaction } from '../../../models/Transaction';

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
          <TransactionTypeBadge type={transaction.type} />
          <span className="text-sm text-gray-500">{formatDate(transaction.date)}</span>
        </div>
        <TransactionActions
          onEdit={() => onEdit(transaction.id)}
          onDelete={() => onDelete(transaction.id)}
          loading={!!loading}
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

export interface TransactionListProps {
  transactions?: Transaction[];
  onTransactionsChanged?: () => void;
  mode?: 'dashboard' | 'full';
}

const StatementList: React.FC<TransactionListProps> = ({ transactions: propTransactions, onTransactionsChanged, mode = 'dashboard' }) => {
  const { transactions: hookTransactions, deleteTransaction, fetchTransactions } = useTransactions();
  const transactions = propTransactions || hookTransactions;
  const { grouped, sortedKeys } = useGroupedTransactions(transactions);
  const editModal = useModal();
  const deleteModal = useModal();
  const [transactionToEdit, setTransactionToEdit] = useState<string | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

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

  const handleDelete = async () => {
    if (transactionToDelete) {
      setFormLoading(true);
      try {
        await deleteTransaction(transactionToDelete);
        closeDeleteModal();
        await fetchTransactions();
        if (onTransactionsChanged) onTransactionsChanged();
      } catch (error) {
        if (typeof window !== "undefined") {
          console.error("Erro ao excluir transação.");
        }
        console.error(error);
      } finally {
        setFormLoading(false);
      }
    }
  };

  const handleEditSuccess = () => {
    fetchTransactions();
    closeEditModal();
    if (onTransactionsChanged) onTransactionsChanged();
  };

  const monthTitleClass = [mode === 'full' ? 'text-lg' : '', 'font-semibold', 'text-gray-600', 'border-b', 'border-gray-200', 'pb-2'].join(' ');

  return (
    <div>
      {/* Lista de transações agrupadas por mês/ano */}
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
        </div>
      ) : (
        <p className="text-white-800">Nenhuma transação registrada.</p>
      )}

      {/* Modais de editar e excluir */}
      <ModalWrapper open={editModal.open} onClose={closeEditModal} title="Editar Transação" size="md">
        <TransactionEdit
          transactionId={transactionToEdit}
          onSuccess={handleEditSuccess}
        />
      </ModalWrapper>
      <ConfirmationModal
        open={deleteModal.open}
        title="Confirmar exclusão"
        description="Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
        loading={formLoading}
      />
    </div>
  );
};

export default StatementList;