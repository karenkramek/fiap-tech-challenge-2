import React, { useEffect, useState } from 'react';
import ModalWrapper from 'shared/components/ui/ModalWrapper';
import { parseCurrencyStringToNumber, createCurrencyInputHandler, formatCurrencyWithoutSymbol } from 'shared/utils/currency';
import BadgeSuggestions from 'shared/components/ui/BadgeSuggestions';

const GOAL_NAME_SUGGESTIONS = [
  'Viajar',
  'Comprar carro',
  'Comprar casa',
  'Casamento',
  'Aposentadoria',
  'Estudos',
  'Reforma',
  'Reserva de emergência',
  'Filhos',
  'Outro objetivo'
];

interface GoalsModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (goal: { name: string; value: number; deadline?: string }) => void;
  initialGoal?: {
    id: string;
    name: string;
    value: number;
    createdAt: string;
    deadline?: string;
    assigned: number;
  } | null;
}

const GoalsModal: React.FC<GoalsModalProps> = ({
  open,
  onClose,
  onSave,
  initialGoal
}) => {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    if (open && initialGoal) {
      setName(initialGoal.name);
      setValue(formatCurrencyWithoutSymbol(initialGoal.value));
      setDeadline(initialGoal.deadline ? new Date(initialGoal.deadline).toISOString().slice(0, 10) : '');
    } else if (open) {
      setName('');
      setValue('');
      setDeadline('');
    }
  }, [open, initialGoal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !value) return;
    if (parseCurrencyStringToNumber(value) <= 0) return;
    if (deadline) {
      onSave({ name: name.trim(), value: parseCurrencyStringToNumber(value), deadline });
    } else {
      onSave({ name: name.trim(), value: parseCurrencyStringToNumber(value) });
    }
    onClose();
  };

  const handleValueChange = createCurrencyInputHandler(setValue);

  const filteredSuggestions = GOAL_NAME_SUGGESTIONS.filter(s =>
    name.length === 0 || s.toLowerCase().includes(name.toLowerCase())
  );

  return (
    <ModalWrapper open={open} onClose={onClose} title={initialGoal ? 'Editar Meta' : 'Nova Meta'} size="sm">
      <form onSubmit={handleSubmit} className="space-y-5 mt-4">
        <div>
          <label className="block text-md font-bold text-primary-700 mb-1">Nome *</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-primary-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-700"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <BadgeSuggestions
            suggestions={filteredSuggestions}
            onSelect={suggestion => setName(suggestion)}
          />
        </div>
        <div>
          <label className="block text-md font-bold text-primary-700 mb-1">Valor *</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white-800">R$</span>
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-primary-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-700"
              value={value}
              onChange={handleValueChange}
              inputMode="numeric"
              placeholder="00,00"
              minLength={1}
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-md font-bold text-primary-700 mb-1">
            Data Limite <span className="text-sm font-medium text-white-800">(opcional)</span>
          </label>
          <input
            type="date"
            className="w-full px-4 py-3 rounded-lg border border-primary-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-700"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
          />
        </div>
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="w-full py-3 bg-tertiary-600 hover:bg-tertiary-700 text-white-50 font-medium rounded-lg shadow-md"
            aria-label={initialGoal ? 'Atualizar meta' : 'Adicionar meta'}
          >
            {initialGoal ? 'Atualizar' : 'Adicionar'}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default GoalsModal;