import { Edit, Trash2 } from 'lucide-react';
import React, { useState, useEffect, useRef } from "react";
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
import Tooltip from '../../ui/Tooltip';


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


const TransactionTypeBadgeCustom: React.FC<{ type: TransactionType; originType?: string }> = ({ type, originType }) => {
  if (originType === 'investment') {
    return <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">INVESTIMENTO</span>;
  }
  if (originType === 'goal') {
    return <span className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold">META</span>;
  }
  return <TransactionTypeBadge type={type} />;
};

// Componente para item de transação
const TransactionItem: React.FC<{
  transaction: any;
  mode: 'dashboard' | 'full';
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}> = React.memo(({ transaction, mode, onEdit, onDelete, loading }) => {
  const isEditable = transaction.type !== TransactionType.GOAL && transaction.type !== TransactionType.INVESTMENT;
  const tooltipMessage = transaction.type === TransactionType.INVESTMENT
    ? 'Operação não permitida (investimentos)'
    : 'Operação não permitida (metas)';

  return (
    <div className={`flex flex-col border-b py-2 ${mode === 'full' ? 'px-2' : ''}`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <TransactionTypeBadgeCustom type={transaction.type} originType={transaction.originType} />
          <span className="text-sm text-gray-500">{formatDate(transaction.date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip content={tooltipMessage} disabled={isEditable || loading}>
            <button
              className={`p-1 rounded ${isEditable && !loading ? 'hover:bg-primary-50' : 'bg-gray-100 cursor-not-allowed'}`}
              title={isEditable ? "Editar" : tooltipMessage}
              aria-label="Editar transação"
              onClick={() => onEdit(transaction.id)}
              disabled={!isEditable || loading}
            >
              <Edit className={`h-5 w-5 text-white-800 ${isEditable && !loading ? 'hover:text-primary-700 cursor-pointer' : 'text-gray-400 cursor-not-allowed'} ${loading || !isEditable ? 'opacity-50' : ''}`} />
            </button>
          </Tooltip>
          <Tooltip content={tooltipMessage} disabled={isEditable || loading}>
            <button
              className={`p-1 rounded ${isEditable && !loading ? 'hover:bg-error-50' : 'bg-gray-100 cursor-not-allowed'}`}
              title={isEditable ? "Excluir" : tooltipMessage}
              aria-label="Excluir transação"
              onClick={() => onDelete(transaction.id)}
              disabled={!isEditable || loading}
            >
              <Trash2 className={`h-5 w-5 text-white-800 ${isEditable && !loading ? 'hover:text-error-700 cursor-pointer' : 'text-gray-400 cursor-not-allowed'} ${loading || !isEditable ? 'opacity-50' : ''}`} />
            </button>
          </Tooltip>
        </div>
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
  const lastFilterRef = useRef<string>("");
  const lastTransactionsRef = useRef<Transaction[] | null>(null);
  const lastFilteredRef = useRef<Transaction[]>([]);

  // Filtro otimizado: só filtra se search mudou ou transactions mudou
  let filteredTransactions: Transaction[];
  if (search !== lastFilterRef.current || transactions !== lastTransactionsRef.current) {
    filteredTransactions = filterTransactions(transactions, search);
    lastFilterRef.current = search;
    lastTransactionsRef.current = transactions;
    lastFilteredRef.current = filteredTransactions;
  } else {
    filteredTransactions = lastFilteredRef.current;
  }

  // Limitar para dashboard: mostrar só as 5 mais recentes
  const displayedTransactions =
    mode === 'dashboard'
      ? [...filteredTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)
      : filteredTransactions;

  // Scroll infinito para modo full
  const [page, setPage] = useState(1);
  const [infiniteTransactions, setInfiniteTransactions] = useState<Transaction[]>([]);

  // Resetar paginação ao mudar o filtro de busca ou modo
  useEffect(() => {
    if (mode === 'full') {
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, mode]);

  // Atualizar lista paginada ao mudar a página, displayedTransactions ou mode
  useEffect(() => {
    if (mode === 'full') {
      setInfiniteTransactions(displayedTransactions.slice(0, page * ITEMS_PER_PAGE));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, displayedTransactions, mode]);

  // Corrigir possível loop: se page > 1 e displayedTransactions mudou (ex: novo filtro), garantir que page volte para 1
  useEffect(() => {
    if (mode === 'full' && page > 1 && infiniteTransactions.length > displayedTransactions.length) {
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedTransactions]);

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
    <>
      {/* Skeleton Loader */}
      {isLoading && (
        <div className="space-y-2 mt-1 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col border-b py-2 px-2">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-40 bg-gray-300 rounded" /> {/* badge e date skeleton */}
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-gray-300 rounded" />
                  <div className="h-5 w-5 bg-gray-300 rounded" />
                </div>
              </div>
              <div className="flex items-stretch mb-2 p-1">
                <div className="flex flex-col flex-1 justify-center gap-2">
                  <div className="h-4 w-32 bg-gray-300 rounded" /> {/* description skeleton */}
                  <div className="h-3 w-20 bg-gray-200 rounded" /> {/* attachment skeleton */}
                </div>
                <div className="flex items-center ml-4 min-h-[40px]">
                  <div className="h-6 w-16 bg-gray-300 rounded" /> {/* amount skeleton */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lista de transações agrupadas por mês/ano */}
      {!isLoading && filteredTransactions.length > 0 ? (
        <div role="region" aria-label="Lista de transações agrupadas por mês">
          {sortedKeys.map((key, idx) => {
            const [month, year] = key.split("-");
            const isLast = idx === sortedKeys.length - 1;
            return (
              <div key={key} className={isLast ? "mb-0" : "mb-6"}>
                <h3 className={monthTitleClass}>
                  {getMonthName(month)} {year}
                </h3>
                <div className="space-y-2 mt-1">
                  {grouped[key].map((transaction, tIdx) => {
                    const isLastGroup = idx === sortedKeys.length - 1;
                    const isLastItem = tIdx === grouped[key].length - 1;
                    const isFullMode = mode === 'full';
                    const showGradient = isFullMode && isLastGroup && isLastItem && !showAllRecordsMessage && filteredTransactions.length >= 6;
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
                          />
                        </div>
                        {isFullMode && isLastGroup && isLastItem && showAllRecordsMessage && (
                          <div className="w-full flex justify-center py-4" aria-live="polite">
                            <span className="text-gray-500 text-sm">Todos os registros foram exibidos.</span>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : !isLoading ? (
        <p className="text-white-800">Nenhuma transação encontrada.</p>
      ) : null}

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
    </>
  );
});

export default TransactionList;
