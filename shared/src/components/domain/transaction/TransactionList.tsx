import { Edit, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from "react";
import { useGroupedTransactions } from "../../../hooks/useGroupedTransactions";
import { useModal } from '../../../hooks/useModal';
import { useTransactions } from '../../../hooks/useTransactions';
import { Transaction } from '../../../models/Transaction';
import { TransactionType } from '../../../types/TransactionType';
import { formatCurrencyWithSymbol } from '../../../utils/currency';
import { formatDate, getMonthName } from '../../../utils/date';
import { filterTransactions } from '../../../utils/transactionFilter';
import ConfirmationModal from '../../ui/ConfirmationModal';
import ModalWrapper from '../../ui/ModalWrapper';
import Tooltip from '../../ui/Tooltip';
import AttachmentDisplay from '../file/AttachmentDisplay';
import TransactionEdit from './TransactionEdit';
import TransactionTypeBadge from './TransactionTypeBadge';


// Componente para detalhes da transação
const TransactionDetails: React.FC<{
  description: string;
  attachmentPath?: string;
  transactionType: TransactionType;
  showLabel: boolean;
}> = React.memo(({ description, attachmentPath, transactionType, showLabel }) => (
  <div className="flex flex-col flex-1 justify-center min-w-0">
    <p className="text-gray-700 text-base sm:text-sm mb-1 truncate font-medium">
      {description || "Sem descrição"}
    </p>
    {attachmentPath ? (
      <div className="mt-1">
        <AttachmentDisplay
          attachmentPath={attachmentPath}
          transactionType={transactionType}
          showLabel={showLabel}
          className="text-sm sm:text-xs"
        />
      </div>
    ) : null}
  </div>
));
const TransactionTypeBadgeCustom: React.FC<{ type: TransactionType; originType?: string }> = ({ type, originType }) => {
  if (originType === 'investment') {
    return <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">INVESTIMENTO</span>;
  }
  if (originType === 'goal') {
    return <span className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">META</span>;
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

  // Responsive classes for consistent styling
  const containerClasses = `flex flex-col border-b bg-white hover:bg-gray-50 transition-all duration-300 w-full max-w-full overflow-hidden ${
    mode === 'full' ? 'px-4 sm:px-6' : 'px-2'
  } py-3 sm:py-2`;

  const headerSpacing = 'mb-3 sm:mb-2';
  const buttonPadding = 'p-1.5 sm:p-1';
  const iconSize = 'h-4 w-4 sm:h-4 sm:w-4';

  return (
    <div className={containerClasses}>
      {/* Header com badge, data e ações */}
      <div className={`flex items-center justify-between gap-1 sm:gap-2 ${headerSpacing}`}>
        <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1 overflow-hidden">
          <div className="flex-shrink-0">
            <TransactionTypeBadgeCustom type={transaction.type} originType={transaction.originType} />
          </div>
          <span className="text-sm text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">{formatDate(transaction.date)}</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <Tooltip content={tooltipMessage} disabled={isEditable || loading}>
            <button
              className={`${buttonPadding} rounded touch-manipulation transition-all duration-200 ${isEditable && !loading ? 'hover:bg-primary-50 active:bg-primary-100' : 'bg-gray-100 cursor-not-allowed'}`}
              title={isEditable ? "Editar" : tooltipMessage}
              aria-label="Editar transação"
              onClick={() => onEdit(transaction.id)}
              disabled={!isEditable || loading}
            >
              <Edit className={`${iconSize} text-white-800 transition-colors ${isEditable && !loading ? 'hover:text-primary-700 cursor-pointer' : 'text-gray-400 cursor-not-allowed'} ${loading || !isEditable ? 'opacity-50' : ''}`} />
            </button>
          </Tooltip>
          <Tooltip content={tooltipMessage} disabled={isEditable || loading}>
            <button
              className={`${buttonPadding} rounded touch-manipulation transition-all duration-200 ${isEditable && !loading ? 'hover:bg-error-50 active:bg-error-100' : 'bg-gray-100 cursor-not-allowed'}`}
              title={isEditable ? "Excluir" : tooltipMessage}
              aria-label="Excluir transação"
              onClick={() => onDelete(transaction.id)}
              disabled={!isEditable || loading}
            >
              <Trash2 className={`${iconSize} text-white-800 transition-colors ${isEditable && !loading ? 'hover:text-error-700 cursor-pointer' : 'text-gray-400 cursor-not-allowed'} ${loading || !isEditable ? 'opacity-50' : ''}`} />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Conteúdo principal - mobile layout diferente */}
      <div className="flex gap-3 transition-all duration-300 flex-col sm:flex-row sm:items-center sm:gap-4">
        {/* Descrição e anexo */}
        <div className="flex-1 min-w-0">
          <TransactionDetails
            description={transaction.description}
            attachmentPath={transaction.attachmentPath}
            transactionType={transaction.type}
            showLabel={mode === 'full'}
          />
        </div>

        {/* Valor - destaque maior no mobile */}
        <div className="flex items-center justify-end sm:justify-center sm:ml-4">
          <span className={`font-semibold transition-all duration-300 text-xl sm:text-lg ${transaction.isIncome() ? 'text-green-600' : 'text-red-600'}`}>
            {transaction.isIncome() ? '' : '-'} {formatCurrencyWithSymbol(transaction.amount)}
          </span>
        </div>
      </div>
    </div>
  );
});const ITEMS_PER_PAGE = 5;

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

  // Responsive month title styling
  const monthTitleClass = [
    mode === 'full' ? 'text-xl sm:text-lg' : 'text-lg sm:text-base',
    'font-semibold',
    'text-gray-600',
    'border-b',
    'border-gray-200',
    'pb-3 sm:pb-2',
    'mb-4 sm:mb-2',
    mode === 'full' ? 'px-4 sm:px-6' : 'px-2'
  ].join(' ');  const isLoading = loading;

  return (
    <>
      {/* Skeleton Loader */}
      {isLoading && (
        <div className="space-y-3 sm:space-y-2 mt-1 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`flex flex-col border-b py-3 sm:py-2 w-full max-w-full overflow-hidden ${mode === 'full' ? 'px-4 sm:px-6' : 'px-2'}`}>
              <div className="flex items-center justify-between gap-1 sm:gap-2 mb-3 sm:mb-2">
                <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1 overflow-hidden">
                  <div className="h-6 sm:h-5 w-24 sm:w-20 bg-gray-300 rounded flex-shrink-0" /> {/* badge skeleton */}
                  <div className="h-5 sm:h-4 w-20 sm:w-16 bg-gray-300 rounded flex-shrink-0" /> {/* date skeleton */}
                </div>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <div className="h-6 w-6 sm:h-6 sm:w-6 bg-gray-300 rounded" />
                  <div className="h-6 w-6 sm:h-6 sm:w-6 bg-gray-300 rounded" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex flex-col flex-1 justify-center gap-2">
                  <div className="h-5 sm:h-4 w-40 sm:w-32 bg-gray-300 rounded" /> {/* description skeleton */}
                  <div className="h-4 sm:h-3 w-24 sm:w-20 bg-gray-200 rounded" /> {/* attachment skeleton */}
                </div>
                <div className="flex items-center justify-end sm:justify-center">
                  <div className="h-7 sm:h-6 w-20 sm:w-16 bg-gray-300 rounded" /> {/* amount skeleton */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lista de transações agrupadas por mês/ano */}
      {!isLoading && filteredTransactions.length > 0 ? (
        <div role="region" aria-label="Lista de transações agrupadas por mês" className="space-y-6 sm:space-y-4 w-full max-w-full overflow-hidden">
          {sortedKeys.map((key, idx) => {
            const [month, year] = key.split("-");
            const isLast = idx === sortedKeys.length - 1;
            return (
              <div key={key} className={`w-full max-w-full overflow-hidden ${isLast ? "mb-0" : ""}`}>
                <h3 className={monthTitleClass}>
                  {getMonthName(month)} {year}
                </h3>
                <div className="space-y-1 mt-3 sm:mt-2 w-full max-w-full overflow-hidden">
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
                          <div className="w-full flex justify-center py-6 sm:py-4" aria-live="polite">
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
        <div className="text-center py-8 sm:py-6">
          <p className="text-white-800 text-base sm:text-sm">Nenhuma transação encontrada.</p>
        </div>
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
