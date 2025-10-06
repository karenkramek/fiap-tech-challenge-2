import React, { useState } from 'react';

interface Investment {
  id: string;
  type: 'FUNDOS' | 'TESOURO' | 'PREVIDENCIA' | 'ACOES' | 'CDB';
  amount: number;
  description: string;
  date: string;
}

interface InvestmentFormProps {
  onSubmit: (investment: Omit<Investment, 'id' | 'date'>) => void;
  onCancel: () => void;
}

export const InvestmentForm: React.FC<InvestmentFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    type: 'FUNDOS' as Investment['type'],
    amount: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type: formData.type,
      amount: parseFloat(formData.amount),
      description: formData.description
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de Investimento
        </label>
        <select
          value={formData.type}
          onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Investment['type'] }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="FUNDOS">Fundos de Investimento</option>
          <option value="TESOURO">Tesouro Direto</option>
          <option value="PREVIDENCIA">Previdência Privada</option>
          <option value="ACOES">Ações</option>
          <option value="CDB">CDB</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Valor (R$)
        </label>
        <input
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0,00"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ex: CDB Banco XYZ"
          required
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Investir
        </button>
      </div>
    </form>
  );
};