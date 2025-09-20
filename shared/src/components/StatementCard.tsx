import React, { useState } from "react";
import { Edit, Trash2 } from 'lucide-react';
import Card from './Card';
import TransactionBadge from './TransactionBadge';
import EditTransactionModal from './EditTransactionModal';
import ConfirmationModal from './ConfirmationModal';
import { useTransactions } from '../hooks/useTransactions';
import { useModal } from '../hooks/useModal';
import { formatDate } from '../utils/utils';
import { formatCurrencyWithSymbol } from '../utils/currencyUtils';
import { getMonthName } from '../utils/utils';
import { Transaction } from "../models/Transaction";
import { useGroupedTransactions } from "../hooks/useGroupedTransactions";

const StatementCard: React.FC = () => {
  const { transactions, deleteTransaction, fetchTransactions } = useTransactions();
  const { grouped, sortedKeys } = useGroupedTransactions(transactions);
  const editModal = useModal();
  const deleteModal = useModal();
  const [transactionToEdit, setTransactionToEdit] = useState<string | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

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
      try {
        await deleteTransaction(transactionToDelete);
        closeDeleteModal();
      } catch (error) {
        if (typeof window !== "undefined") {
          // toast.error('Erro ao excluir transação.');
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

  return (
    <div className="sm:col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-1 space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="transactions-title text-primary-700">Extrato</h2>
        </div>
        {transactions.length > 0 ? (
          <div>
            {sortedKeys.map((key) => {
              const [month, year] = key.split("-");
              return (
                <div key={key} className="mb-6">
                  <h3 className="transactions-subtitle font-medium text-primary-700 mb-2">
                    {getMonthName(month)} {year}
                  </h3>
                  <div className="space-y-2">
                    {grouped[key].map((transaction) => (
                      <div key={transaction.id} className="flex flex-col border-b py-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <TransactionBadge type={transaction.type} />
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <button
                              className="p-1 hover:bg-primary-50 rounded"
                              title="Editar"
                              onClick={() => openEditModal(transaction.id)}
                            >
                              <Edit className="h-5 w-5 text-white-800 hover:text-primary-700 cursor-pointer" />
                            </button>
                            <button
                              className="p-1 hover:bg-error-50 rounded"
                              title="Excluir"
                              onClick={() => openDeleteModal(transaction.id)}
                            >
                              <Trash2 className="h-5 w-5 text-white-800 hover:text-error-700 cursor-pointer" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex flex-col items-start min-w-0">
                            <p className="text-xs text-white-800">
                              {formatDate(transaction.date)}
                            </p>
                            <p className="text-xs text-white-800 truncate">
                              {transaction.description || "Sem descrição"}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <p className={`text-sm font-medium ${transaction.isIncome() ? "text-green-600" : "text-red-600"}`}>
                              {transaction.isIncome() ? "+" : "-"} {formatCurrencyWithSymbol(transaction.amount)}
                            </p>
                          </div>
                        </div>
                      </div>
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
    </div>
  );
};

export default StatementCard;