import React from 'react';
import { Link } from 'react-router-dom';
import AttachmentDisplay from 'shared/components/AttachmentDisplay';
import Button from 'shared/components/Button';
import Card from 'shared/components/Card';
import ConfirmationModal from 'shared/components/ConfirmationModal';
import EditTransactionModal from 'shared/components/EditTransactionModal';
import TransactionBadge from 'shared/components/TransactionBadge';
import { useTransactions } from 'shared/hooks/useTransactions';
import { formatCurrencyWithSymbol } from 'shared/utils/currencyUtils';
import { formatDate, getMonthKey, getMonthName } from 'shared/utils/utils';

const TransactionsPage: React.FC = () => {
  const { transactions, loading, deleteTransaction, fetchTransactions } = useTransactions();
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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
      const monthKey = getMonthKey(date);

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
    <div className="space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h1 className="transactions-title text-primary-700">Extrato</h1>
          {/* <Link to="/transactions"> */}
            <Button variant="primary">Nova Transação</Button>
          {/* </Link> */}
        </div>
        <div className="space-y-6">
          {transactions.length > 0 ? (
            sortedKeys.map((key) => {
              const [month, year] = key.split("-").map(Number);
              const monthName = getMonthName(month);

              return (
                <div key={key} className="space-y-3">
                  <h2 className="text-lg font-semibold text-gray-600 border-b border-gray-200 pb-2">
                    {monthName} {year}
                  </h2>

                  <div className="space-y-2">
                    {grouped[key].map((transaction) => (
                      <div key={transaction.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <TransactionBadge type={transaction.type} />
                              <span className="text-sm text-gray-500">
                                {formatDate(transaction.date)}
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm mb-2">
                              {transaction.description || "Sem descrição"}
                            </p>
                            {transaction.attachmentPath && (
                              <div className="mt-2">
                                <AttachmentDisplay
                                  attachmentPath={transaction.attachmentPath}
                                  {...({ transactionType: transaction.type } as any)}
                                  className="text-xs"
                                />
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col items-end gap-2 ml-4">
                            <p
                              className={`text-lg font-semibold ${
                                transaction.isIncome()
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {transaction.isIncome() ? "" : "-"}{" "}
                              {formatCurrencyWithSymbol(transaction.amount)}
                            </p>

                            <div className="flex space-x-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => openEditModal(transaction.id)}
                              >
                                Editar
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => openDeleteModal(transaction.id)}
                              >
                                Excluir
                              </Button>
                            </div>
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
              <Link to="/dashboard">
                <Button variant="primary">Adicionar nova transação</Button>
              </Link>
            </div>
          )}
        </div>
      </Card>

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

export default TransactionsPage;
