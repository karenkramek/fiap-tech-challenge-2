import React from 'react';
import Card from './Card';
import Button from './Button';
import { TransactionType } from '../types/TransactionType';

interface TransactionFormProps {
  amount: string;
  transactionType: TransactionType;
  description: string;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  amount,
  transactionType,
  description,
  onAmountChange,
  onTypeChange,
  onDescriptionChange,
  onSubmit,
  loading = false
}) => (
  <Card className='bg-white-50 rounded-xl shadow-md'>
    <h2 className='text-xl font-semibold text-primary-700 mb-5'>
      Nova transação
    </h2>
    <form onSubmit={onSubmit} className='space-y-5'>
      <div>
        <select
          id='type'
          value={transactionType}
          onChange={onTypeChange}
          className='w-full px-4 py-3 rounded-lg border border-primary-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-700 bg-white-50'
          disabled={loading}
        >
          <option value={TransactionType.DEPOSIT}>Depósito</option>
          <option value={TransactionType.WITHDRAWAL}>Saque</option>
          <option value={TransactionType.TRANSFER}>Transferência</option>
          <option value={TransactionType.PAYMENT}>Pagamento</option>
        </select>
      </div>
      <div>
        <label className='block text-lg font-bold text-primary-700 mb-1'>
          Valor
        </label>
        <div className='relative'>
          <span className='absolute inset-y-0 left-0 flex items-center pl-4 text-white-800'>
            R$
          </span>
          <input
            type='text'
            value={amount}
            onChange={onAmountChange}
            inputMode='numeric'
            placeholder='00,00'
            className='w-full pl-12 pr-4 py-3 rounded-lg border border-primary-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-700'
            disabled={loading}
          />
        </div>
      </div>
      <div>
        <label className='block text-lg font-bold text-primary-700 mb-1'>
          Descrição <span className='text-sm font-medium text-white-800'>(opcional)</span>
        </label>
        <input
          type='text'
          value={description}
          onChange={onDescriptionChange}
          placeholder='Descrição da transação'
          className='w-full px-4 py-3 rounded-lg border border-primary-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-700'
          disabled={loading}
        />
      </div>
      <div className='pt-2'>
        <Button type='submit' variant='active' className='w-full py-3 bg-tertiary-600 hover:bg-tertiary-700 text-white-50 font-medium rounded-lg shadow-md' disabled={loading}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white-50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Salvando...
            </span>
          ) : (
            'Concluir transação'
          )}
        </Button>
      </div>
    </form>
  </Card>
);

export default TransactionForm;
