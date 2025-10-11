import { Edit, Trash2 } from 'lucide-react';
import React, { useState, useEffect } from "react";
import { useGroupedTransactions } from "../../../hooks/useGroupedTransactions";
import { useModal } from '../../../hooks/useModal';
import { useTransactions } from '../../../hooks/useTransactions';
import { formatCurrencyWithSymbol } from '../../../utils/currency';
import { formatDate, getMonthName } from '../../../utils/date';
import AttachmentDisplay from '../file/AttachmentDisplay';
import ConfirmationModal from '../../ui/ConfirmationModal';
import TransactionEdit from './TransactionEdit';
import TransactionTypeBadge from './TransactionTypeBadge';
import { TransactionType } from '../../../types/TransactionType';
import ModalWrapper from '../../ui/ModalWrapper';
import { Transaction } from '../../../models/Transaction';
import { filterTransactions } from '../../../utils/transactionFilter';

// Componente para ações de transação - SIMPLIFICADO
const TransactionActions: React.FC<{
  onEdit: () => void;
  onDelete: () => void;
  loading?: boolean;
  transaction: any;
}> = React.memo(({ onEdit, onDelete, loading, transaction }) => {
  const isIncome = transaction.isIncome();
  const description = transaction.description || 'Sem descrição';
  const value = formatCurrencyWithSymbol(transaction.amount);
  
  // Formatação de data legível para leitor de tela
  const formatDateForScreenReader = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };
  
  const date = formatDateForScreenReader(transaction.date);
  
  return (
    <div className="flex items-center gap-2">
      <button
        className="p-1 hover:bg-primary-50 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        aria-label={`Editar transação - ${description} - ${value} - ${date}`}
        onClick={onEdit}
        disabled={loading}
      >
        <Edit className={`h-5 w-5 text-white-800 hover:text-primary-700 cursor-pointer ${loading ? 'opacity-50' : ''}`} aria-hidden="true" />
      </button>
      <button
        className="p-1 hover:bg-error-50 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-error-500"
        aria-label={`Excluir transação - ${description} - ${value} - ${date}`}
        onClick={onDelete}
        disabled={loading}
      >
        <Trash2 className={`h-5 w-5 text-white-800 hover:text-error-700 cursor-pointer ${loading ? 'opacity-50' : ''}`} aria-hidden="true" />
      </button>
    </div>
  );
});

// Componente para detalhes da transação - SIMPLIFICADO
const TransactionDetails: React.FC<{
  description: string;
  attachmentPath?: string;
  transactionType: TransactionType;
  showLabel: boolean;
}> = React.memo(({ description, attachmentPath, transactionType, showLabel }) => (
  <div className="flex flex-col flex-1 justify-center">
    <p className="text-gray-700 text-sm mb-0 truncate">
      {description || "Sem descrição"}
    </p>
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

// Componente para item de transação - SIMPLIFICADO
const TransactionItem: React.FC<{
  transaction: any;
  mode: 'dashboard' | 'full';
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
  index: number;
}> = React.memo(({ transaction, mode, onEdit, onDelete, loading, index }) => {
  const isIncome = transaction.isIncome();
  
  return (
    <article className={`flex flex-col border-b py-2 ${mode === 'full' ? 'px-2' : ''}`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <TransactionTypeBadge type={transaction.type} />
          <time className="text-sm text-gray-500" dateTime={transaction.date}>
            {formatDate(transaction.date)}
          </time>
        </div>
        <TransactionActions
          onEdit={() => onEdit(transaction.id)}
          onDelete={() => onDelete(transaction.id)}
          loading={!!loading}
          transaction={transaction}
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
          <span className={`text-lg font-semibold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
            {isIncome ? '' : '-'} {formatCurrencyWithSymbol(transaction.amount)}
          </span>
        </div>
      </div>
    </article>
  );
});

const ITEMS_PER_PAGE = 5;

export interface TransactionListProps {
  transactions?: Transaction[];
  onTransactionsChanged?: () => void;
  mode?: 'dashboard' | 'full';
  search?: string;
  totalTransactions?: number;
}

const TransactionList: React.FC<TransactionListProps> = React.memo(({ transactions: propTransactions, onTransactionsChanged, mode = 'dashboard', search = '', totalTransactions }) => {
  const { transactions: hookTransactions, deleteTransaction, fetchTransactions, loading } = useTransactions();
  const transactions = propTransactions || hookTransactions;
  const filteredTransactions = filterTransactions(transactions, search);

  // Limitar para dashboard: mostrar só as 5 mais recentes
  const displayedTransactions =
    mode === 'dashboard'
      ? [...filteredTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)
      : filteredTransactions;

  // Scroll infinito para modo full
  const [page, setPage] = useState(1);
  const [infiniteTransactions, setInfiniteTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (mode === 'full') {
      setInfiniteTransactions(displayedTransactions.slice(0, page * ITEMS_PER_PAGE));
    }
  }, [displayedTransactions, page, mode]);

  const transactionsToRender = mode === 'full' ? infiniteTransactions : displayedTransactions;

  // Scroll infinito e mensagem só no modo full
  let showAllRecordsMessage = false;
  if (mode === 'full' && typeof totalTransactions === 'number' && transactionsToRender.length >= totalTransactions && totalTransactions > 0) {
    showAllRecordsMessage = true;
  }

  useEffect(() => {
    if (mode !== 'full') return;
    const handleScroll = () => {
      const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 100;
      if (bottom && infiniteTransactions.length < displayedTransactions.length) {
        setPage(prev => prev + 1);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [infiniteTransactions.length, displayedTransactions.length, mode]);

  const { grouped, sortedKeys } = useGroupedTransactions(transactionsToRender);
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

  const isLoading = loading;

  return (
    <div>
      {/* Anúncio para leitores de tela */}
      <div className="sr-only" aria-live="polite">
        {isLoading ? 'Carregando transações...' : 
         filteredTransactions.length === 0 ? 'Nenhuma transação encontrada' :
         `${filteredTransactions.length} transação${filteredTransactions.length !== 1 ? 'ões' : ''} encontrada${filteredTransactions.length !== 1 ? 's' : ''}`}
      </div>

      {/* Lista de transações agrupadas por mês/ano - SIMPLIFICADA */}
      {!isLoading && filteredTransactions.length > 0 ? (
        <div>
          {sortedKeys.map((key, idx) => {
            const [month, year] = key.split("-");
            const isLast = idx === sortedKeys.length - 1;
            let transactionIndex = 0;
            for (let i = 0; i < idx; i++) {
              transactionIndex += grouped[sortedKeys[i]].length;
            }
            
            return (
              <section key={key} className={isLast ? "mb-0" : "mb-6"}>
                <h3 className={monthTitleClass}>
                  {getMonthName(month)} {year}
                </h3>
                <div className="space-y-2 mt-1">
                  {grouped[key].map((transaction, tIdx) => {
                    const isLastGroup = idx === sortedKeys.length - 1;
                    const isLastItem = tIdx === grouped[key].length - 1;
                    const isFullMode = mode === 'full';
                    const showGradient = isFullMode && isLastGroup && isLastItem && !showAllRecordsMessage;
                    return (
                      <React.Fragment key={transaction.id}>
                        <div style={showGradient ? {
                          position: 'relative',
                          zIndex: 0,
                          WebkitMaskImage: 'linear-gradient(to bottom,black 10%,transparent 80%)',
                          maskImage: 'linear-gradient(to bottom,black 10%,transparent 80%)',
                        } : {}}>
                          <TransactionItem
                            transaction={transaction}
                            mode={mode}
                            onEdit={openEditModal}
                            onDelete={openDeleteModal}
                            loading={formLoading}
                            index={transactionIndex + tIdx}
                          />
                        </div>
                        {isFullMode && isLastGroup && isLastItem && showAllRecordsMessage && (
                          <div className="w-full flex justify-center py-4" role="status" aria-live="polite">
                            <span className="text-gray-500 text-sm">Todos os registros foram exibidos.</span>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      ) : !isLoading ? (
        <div role="status" aria-live="polite">
          <p className="text-white-800">Nenhuma transação encontrada.</p>
        </div>
      ) : null}

      {/* Modais mantidos iguais */}
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

      {/* CSS para sr-only */}
      <style jsx>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </div>
  );
});

export default TransactionList;
