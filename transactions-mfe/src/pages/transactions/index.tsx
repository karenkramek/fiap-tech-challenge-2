"use client";

import React from "react";
import Card from "shared/components/Card";
import Button from "shared/components/Button";
import TransactionBadge from "shared/components/TransactionBadge";
import ConfirmationModal from "shared/components/ConfirmationModal";
import EditTransactionModal from "shared/components/EditTransactionModal";
import { formatDate, getMonthName } from "shared/utils/utils";
import { formatCurrencyWithSymbol } from "shared/utils/currencyUtils";
import { useTransactions } from "shared/hooks/useTransactions";
import "./transactions.css";

export default function TransactionsPage() {
  const { transactions, loading, deleteTransaction, fetchTransactions } = useTransactions();
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const [modalOpen, setModalOpen] = React.useState(false);
  const [transactionToDelete, setTransactionToDelete] = React.useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [transactionToEdit, setTransactionToEdit] = React.useState<string | null>(null);

  // Exclui uma transação
  const handleDelete = async () => {
    if (transactionToDelete) {
      try {
        await deleteTransaction(transactionToDelete);
        setModalOpen(false);
        setTransactionToDelete(null);
      } catch (error) {
        if (typeof window !== "undefined") {
          console.error("Erro ao excluir transação.");
        }
        console.error(error);
      }
    }
  };

  // Abre modal de exclusão
  const openDeleteModal = (id: string) => {
    setTransactionToDelete(id);
    setModalOpen(true);
  };

  // Fecha modal de exclusão
  const closeDeleteModal = () => {
    setModalOpen(false);
    setTransactionToDelete(null);
  };

  // Abre modal de edição
  const openEditModal = (id: string) => {
    setTransactionToEdit(id);
    setEditModalOpen(true);
  };

  // Fecha modal de edição
  const closeEditModal = () => {
    setEditModalOpen(false);
    setTransactionToEdit(null);
  };

  // Agrupa transações por mês
  const groupTransactionsByMonth = () => {
    const grouped: Record<string, typeof transactions> = {};

    sortedTransactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;

      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }

      grouped[monthKey].push(transaction);
    });

    // Ordena meses do mais recente para o mais antigo
    const sortedKeys = Object.keys(grouped).sort((a, b) => {
      const [monthA, yearA] = a.split("-").map(Number);
      const [monthB, yearB] = b.split("-").map(Number);

      if (yearA !== yearB) {
        return yearB - yearA;
      }

      return monthB - monthA;
    });

    // Ordena transações dentro de cada mês
    for (const key of sortedKeys) {
      grouped[key] = grouped[key].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }

    return { grouped, sortedKeys };
  };

  const { grouped, sortedKeys } = groupTransactionsByMonth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="transactions-loading">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Sidebar em telas maiores */}
        <div className="hidden bg-white-50 rounded-lg shadow-md xl:block lg:hidden md:col-span-1">
          {/* <Sidebar /> */}
        </div>

        {/* Conteúdo principal */}
        <div className="col-span-1 md:col-span-5 xl:col-span-4 space-y-6">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h1 className="transactions-page-title">Extrato</h1>
              <a href="/transactions/add">
                <Button variant="primary">Nova Transação</Button>
              </a>
            </div>
            <div className="space-y-8">
              {transactions.length > 0 ? (
                sortedKeys.map((key) => {
                  const [month, year] = key.split("-").map(Number);
                  const monthName = getMonthName(month);

                  return (
                    <div key={key} className="space-y-4">
                      <h2 className="transactions-month-header">
                        {monthName} {year}
                      </h2>

                      <div className="space-y-3">
                        {grouped[key].map((transaction) => (
                          <div key={transaction.id} className="transaction-item flex justify-between items-center">
                            <div>
                              <div className="flex items-center">
                                <TransactionBadge type={transaction.type} />
                                <p className="transaction-date-small ml-2">
                                  {formatDate(transaction.date)}
                                </p>
                              </div>
                              <p className="transaction-description">
                                {transaction.description || "Sem descrição"}
                              </p>
                            </div>

                            <div className="flex flex-col items-end">
                              <p
                                className={`transaction-amount ${
                                  transaction.isIncome()
                                    ? "positive"
                                    : "negative"
                                }`}
                              >
                                {transaction.isIncome() ? "+" : "-"}{" "}
                                {formatCurrencyWithSymbol(transaction.amount)}
                              </p>

                              <div className="mt-2 flex space-x-2">
                                <Button
                                  variant="secondary"
                                  onClick={() => openEditModal(transaction.id)}
                                >
                                  Editar
                                </Button>
                                <Button
                                  variant="danger"
                                  onClick={() => openDeleteModal(transaction.id)}
                                >
                                  Excluir
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="transactions-empty">
                  <p className="transactions-empty-title mb-2">
                    Nenhuma transação encontrada.
                  </p>
                  <a href="/transactions/add">
                    <Button variant="primary">Adicionar nova transação</Button>
                  </a>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Modal de confirmação de exclusão */}
      {modalOpen && (
        <ConfirmationModal
          open={modalOpen}
          title="Confirmar exclusão"
          description="Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita."
          confirmText="Excluir"
          cancelText="Cancelar"
          onConfirm={handleDelete}
          onCancel={closeDeleteModal}
          loading={false}
        />
      )}

      {/* Modal de edição de transação */}
      <EditTransactionModal
        open={editModalOpen}
        onClose={closeEditModal}
        transactionId={transactionToEdit}
        onSuccess={fetchTransactions}
      />
    </div>
  );
}
