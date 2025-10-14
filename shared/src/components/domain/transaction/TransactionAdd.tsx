import React, { useRef } from 'react';
import { INVESTMENT_DESCRIPTION_SUGGESTIONS, TRANSACTION_DESCRIPTION_SUGGESTIONS } from '../../../constants/transactionDescriptions';
import { TransactionType, getTransactionTypeLabel } from '../../../types/TransactionType';
import BadgeSuggestions from '../../ui/BadgeSuggestions';
import Button from '../../ui/Button';
import FileUpload from '../file/FileUpload';

interface TransactionAddProps {
  amount: string;
  transactionType: TransactionType;
  description: string;
  attachmentFile: File | null;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileSelect: (file: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose?: () => void;
  loading?: boolean;
}

const TransactionAdd: React.FC<TransactionAddProps> = ({
  amount,
  transactionType,
  description,
  attachmentFile,
  onAmountChange,
  onTypeChange,
  onDescriptionChange,
  onFileSelect,
  onSubmit,
  onClose,
  loading = false
}) => {

  const descriptionInputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = transactionType === TransactionType.INVESTMENT
    ? INVESTMENT_DESCRIPTION_SUGGESTIONS.filter(suggestion =>
        description.length === 0 || (suggestion.toLowerCase().includes(description.toLowerCase()) && suggestion.toLowerCase() !== description.toLowerCase())
      )
    : description.length > 0
      ? TRANSACTION_DESCRIPTION_SUGGESTIONS.filter(suggestion =>
          suggestion.toLowerCase().includes(description.toLowerCase()) && suggestion.toLowerCase() !== description.toLowerCase()
        )
      : TRANSACTION_DESCRIPTION_SUGGESTIONS;

  const handleSuggestionClick = (suggestion: string) => {
    onDescriptionChange({ target: { value: suggestion } } as React.ChangeEvent<HTMLInputElement>);
    descriptionInputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (onSubmit) onSubmit(e);
    // O fechamento deve ser controlado pelo pai após sucesso, mas pode ser chamado aqui se necessário
    // Exemplo: onClose && onClose();
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4 sm:space-y-5 mt-2 sm:mt-4'>
      <div>
        <label className='block text-sm sm:text-md font-bold text-primary-700 mb-1'>Tipo *</label>
        <select
          id='type'
          value={transactionType}
          onChange={onTypeChange}
          className='w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-primary-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-700 bg-white-50 text-sm sm:text-base'
          disabled={loading}
          required
        >
          {Object.values(TransactionType)
            .filter((type: TransactionType) => type !== TransactionType.INVESTMENT && type !== TransactionType.GOAL)
            .map((type: TransactionType) => (
              <option key={type} value={type}>{getTransactionTypeLabel(type)}</option>
            ))}
        </select>
      </div>
      <div>
        <label className='block text-sm sm:text-md font-bold text-primary-700 mb-1'>Valor *</label>
        <div className='relative'>
          <span className='absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 text-white-800 text-sm sm:text-base'>R$</span>
          <input
            type='text'
            value={amount}
            onChange={onAmountChange}
            inputMode='numeric'
            placeholder='00,00'
            className='w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 rounded-lg border border-primary-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-700 text-sm sm:text-base'
            disabled={loading}
            required
          />
        </div>
      </div>
      <div>
        <label className='block text-sm sm:text-md font-bold text-primary-700 mb-1'>
          Descrição <span className='text-xs sm:text-sm font-medium text-white-800'>(opcional)</span>
        </label>
        <input
          type='text'
          value={description}
          onChange={onDescriptionChange}
          ref={descriptionInputRef}
          placeholder='Descrição da transação'
          className='w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-primary-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-700 text-sm sm:text-base'
          disabled={loading}
        />
        <BadgeSuggestions suggestions={filteredSuggestions} onSelect={handleSuggestionClick} />
      </div>
      <FileUpload
        onFileSelect={onFileSelect}
        selectedFile={attachmentFile}
        disabled={loading}
      />
      <div className='flex gap-4 pt-2 sm:pt-4'>
        <Button type='submit' variant='active' className='w-full py-2 sm:py-3 bg-tertiary-600 hover:bg-tertiary-700 text-white-50 font-medium rounded-lg shadow-md text-sm sm:text-base' disabled={loading}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white-50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Salvando...
            </span>
          ) : (
            'Adicionar'
          )}
        </Button>
      </div>
    </form>
  );
};

export default TransactionAdd;
