import React, { useRef } from 'react';
import { TransactionType, getTransactionTypeLabel } from '../../../types/TransactionType';
import Button from '../../ui/Button';
import FileUpload from '../file/FileUpload';
import BadgeSuggestions from '../../ui/BadgeSuggestions';
import { TRANSACTION_DESCRIPTION_SUGGESTIONS, INVESTMENT_DESCRIPTION_SUGGESTIONS } from '../../../constants/transactionDescriptions';

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

  return (
    <form 
      onSubmit={onSubmit} 
      className='space-y-5 mt-4'
      aria-label="Formulário de nova transação"
    >
      <div>
        <label htmlFor='transaction-type' className='block text-md font-bold text-primary-700 mb-1'>
          Tipo <span aria-hidden="true">*</span>
        </label>
        <select
          id='transaction-type'
          value={transactionType}
          onChange={onTypeChange}
          className='w-full px-4 py-3 rounded-lg border border-primary-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-700 bg-white-50'
          disabled={loading}
          required
          aria-required="true"
        >
          {Object.values(TransactionType)
            .filter((type: TransactionType) => type !== TransactionType.INVESTMENT && type !== TransactionType.GOAL)
            .map((type: TransactionType) => (
              <option key={type} value={type}>{getTransactionTypeLabel(type)}</option>
            ))}
        </select>
      </div>

      <div>
        <label htmlFor='transaction-amount' className='block text-md font-bold text-primary-700 mb-1'>
          Valor <span aria-hidden="true">*</span>
        </label>
        <div className='relative'>
          <span className='absolute inset-y-0 left-0 flex items-center pl-4 text-white-800' aria-hidden="true">
            R$
          </span>
          <input
            id='transaction-amount'
            type='text'
            value={amount}
            onChange={onAmountChange}
            inputMode='numeric'
            placeholder='00,00'
            aria-placeholder=""
            className='w-full pl-12 pr-4 py-3 rounded-lg border border-primary-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-700'
            disabled={loading}
            required
            aria-required="true"
            aria-label="Valor em reais, campo obrigatório"
          />
        </div>
      </div>

      <div>
        <label htmlFor='transaction-description' className='block text-md font-bold text-primary-700 mb-1'>
          Descrição <span className='text-sm font-medium text-white-800'>(opcional)</span>
        </label>
        <input
          id='transaction-description'
          type='text'
          value={description}
          onChange={onDescriptionChange}
          ref={descriptionInputRef}
          placeholder='Descrição da transação'
          className='w-full px-4 py-3 rounded-lg border border-primary-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-700'
          disabled={loading}
        />
        <BadgeSuggestions 
          suggestions={filteredSuggestions} 
          onSelect={handleSuggestionClick}
        />
      </div>

      <FileUpload
        onFileSelect={onFileSelect}
        selectedFile={attachmentFile}
        disabled={loading}
      />

      <div className='flex gap-4 pt-4'>
        <Button 
          type='submit' 
          variant='active' 
          className='w-full py-3 bg-tertiary-600 hover:bg-tertiary-700 text-white-50 font-medium rounded-lg shadow-md' 
          disabled={loading}
          aria-label="Adicionar transação"
        >
          {loading ? 'Salvando...' : 'Adicionar'}
        </Button>
      </div>
    </form>
  );
};

export default TransactionAdd;
