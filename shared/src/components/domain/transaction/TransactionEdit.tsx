import React, { useEffect, useState, useRef } from 'react';
import { useTransactions } from '../../../hooks/useTransactions';
import { TransactionService } from '../../../services/TransactionService';
import { TransactionType, getTransactionTypeLabel } from '../../../types/TransactionType';
import { createCurrencyInputHandler, formatCurrencyWithoutSymbol, parseCurrencyStringToNumber } from '../../../utils/currency';
import { formatDateForInput } from '../../../utils/date';
import Button from '../../ui/Button';
import FileUpload from '../file/FileUpload';
import BadgeSuggestions from '../../ui/BadgeSuggestions';
import { TRANSACTION_DESCRIPTION_SUGGESTIONS, INVESTMENT_DESCRIPTION_SUGGESTIONS } from '../../../constants/transactionDescriptions';

interface TransactionEditProps {
  transactionId: string | null;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function TransactionEdit({ transactionId, onSuccess, onClose }: TransactionEditProps) {
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
  const descriptionInputRef = useRef<HTMLInputElement | null>(null);

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
    } catch {
      setError('Erro ao atualizar transação. Tente novamente.');
      setLoading(false);
    }
  };

  const filteredSuggestions = type === TransactionType.INVESTMENT
    ? INVESTMENT_DESCRIPTION_SUGGESTIONS.filter(suggestion =>
        description.length === 0 || (suggestion.toLowerCase().includes(description.toLowerCase()) && suggestion.toLowerCase() !== description.toLowerCase())
      )
    : description.length > 0
      ? TRANSACTION_DESCRIPTION_SUGGESTIONS.filter(suggestion =>
          suggestion.toLowerCase().includes(description.toLowerCase()) && suggestion.toLowerCase() !== description.toLowerCase()
        )
      : TRANSACTION_DESCRIPTION_SUGGESTIONS;

  const handleSuggestionClick = (suggestion: string) => {
    setDescription(suggestion);
    descriptionInputRef.current?.focus();
  };

  if (!open) return null;
  return (
    <>
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
            <label className="block text-md font-bold text-primary-700 mb-1">Tipo *</label>
            <select
              id="type"
              value={type}
              onChange={e => setType(e.target.value as TransactionType)}
              className="w-full px-4 py-3 rounded-lg border border-primary-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-700 bg-white-50"
              disabled={loading}
              required
            >
              {Object.values(TransactionType)
                .filter(t => t !== TransactionType.INVESTMENT && t !== TransactionType.GOAL)
                .map((t) => (
                  <option key={t} value={t}>{getTransactionTypeLabel(t)}</option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-md font-bold text-primary-700 mb-1">Valor *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white-800">R$</span>
              <input
                type="text"
                id="amount"
                value={amount}
                onChange={handleAmountChange}
                inputMode="numeric"
                placeholder="00,00"
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-primary-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-700"
                disabled={loading}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-md font-bold text-primary-700 mb-1">Data *</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-primary-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-700"
              disabled={loading}
              required
            />
          </div>
          <div>
            <label className="block text-md font-bold text-primary-700 mb-1">
              Descrição <span className="text-sm font-medium text-white-800">(opcional)</span>
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              ref={descriptionInputRef}
              placeholder="Descrição da transação"
              className="w-full px-4 py-3 rounded-lg border border-primary-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-700"
              disabled={loading}
            />
            <BadgeSuggestions suggestions={filteredSuggestions} onSelect={handleSuggestionClick} />
          </div>
          <FileUpload
            onFileSelect={setAttachmentFile}
            selectedFile={attachmentFile}
            existingFilePath={existingAttachmentPath ?? ''}
            disabled={loading}
          />
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              variant="active"
              className="w-full py-3 bg-tertiary-600 hover:bg-tertiary-700 text-white-50 font-medium rounded-lg shadow-md"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white-50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Salvando...
                </span>
              ) : (
                'Atualizar'
              )}
            </Button>
          </div>
        </form>
      )}
    </>
  );
}
