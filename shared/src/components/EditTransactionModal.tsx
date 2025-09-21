import React, { useEffect, useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { TransactionService } from '../services/TransactionService';
import { TransactionType } from '../types/TransactionType';
import { createCurrencyInputHandler, formatCurrencyWithoutSymbol, parseCurrencyStringToNumber } from '../utils/currencyUtils';
import { formatDateForInput } from '../utils/utils';
import Button from './Button';
import FileUpload from './FileUpload';

interface EditTransactionModalProps {
  open: boolean;
  onClose: () => void;
  transactionId: string | null;
  onSuccess?: () => void;
}

export default function EditTransactionModal({ open, onClose, transactionId, onSuccess }: EditTransactionModalProps) {
  const { updateTransaction } = useTransactions();
  const [type, setType] = useState<TransactionType>(TransactionType.DEPOSIT);
  const [amount, setAmount] = useState<string>('');
  const handleAmountChange = createCurrencyInputHandler(setAmount);
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [existingAttachmentPath, setExistingAttachmentPath] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState<boolean>(false);

  useEffect(() => {
    if (!open || !transactionId) return;
    const fetchTransaction = async () => {
      setFetching(true);
      try {
        const transaction = await TransactionService.getTransactionById(transactionId);
        setType(transaction.type);
        setAmount(formatCurrencyWithoutSymbol(transaction.amount));
        setDescription(transaction.description || '');
        setDate(formatDateForInput(transaction.date));
        setExistingAttachmentPath(transaction.attachmentPath);
        setAttachmentFile(null);
        setError(null);
      } catch {
        setError('Erro ao carregar os dados da transação.');
      } finally {
        setFetching(false);
      }
    };
    fetchTransaction();
  }, [open, transactionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const normalizedAmount = parseCurrencyStringToNumber(amount);
    if (!amount || isNaN(normalizedAmount) || normalizedAmount <= 0) {
      setError('Por favor, insira um número positivo maior que 0.');
      return;
    }
    if (!date) {
      setError('Por favor, selecione uma data.');
      return;
    }
    setLoading(true);
    try {
      const [year, month, day] = date.split('-').map(Number);
      const localDate = new Date(year, month - 1, day);
      await updateTransaction(
        transactionId!,
        type,
        normalizedAmount,
        localDate,
        description,
        attachmentFile || undefined
      );
      setLoading(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch {
      setError('Erro ao atualizar transação. Tente novamente.');
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 !m-0 modal-overlay flex items-center justify-center z-50">
      <div className="modal-content relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none z-10"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>
        <h2 className="modal-title">Editar Transação</h2>
        {fetching ? (
          <div className="flex justify-center items-center h-32">
            <p className="transactions-loading">Carregando...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-primary-700 mb-1">Tipo de Transação*</label>
              <select
                id="type"
                value={type}
                onChange={e => setType(e.target.value as TransactionType)}
                className="w-full px-4 py-3 rounded-lg border border-primary-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-700 bg-white-50"
                required
              >
                <option value={TransactionType.DEPOSIT}>Depósito</option>
                <option value={TransactionType.WITHDRAWAL}>Saque</option>
                <option value={TransactionType.TRANSFER}>Transferência</option>
                <option value={TransactionType.PAYMENT}>Pagamento</option>
              </select>
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-primary-700 mb-1">Valor*</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white-800">R$</span>
                <input
                  type="text"
                  id="amount"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0,00"
                  inputMode="decimal"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-primary-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-700"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-primary-700 mb-1">Data*</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-primary-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-700"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-primary-700 mb-1">Descrição (opcional)</label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Descrição da transação"
                className="w-full px-4 py-3 rounded-lg border border-primary-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-700"
              />
            </div>
            <FileUpload
              onFileSelect={setAttachmentFile}
              selectedFile={attachmentFile}
              existingFilePath={existingAttachmentPath}
              disabled={loading}
            />
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="active"
                className="bg-tertiary-600 hover:bg-tertiary-700 text-white-50 font-medium"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
