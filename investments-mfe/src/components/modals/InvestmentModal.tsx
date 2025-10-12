import React, { useEffect, useState, useRef } from 'react';
import Button from 'shared/components/ui/Button';
import ModalWrapper from 'shared/components/ui/ModalWrapper';
import { createCurrencyInputHandler, parseCurrencyStringToNumber } from 'shared/utils/currency';
import { InvestmentType, INVESTMENT_TYPE_LABELS } from 'shared/types/InvestmentType';
import { useInvestments } from '../../hooks/useInvestments';

export const INVESTMENT_TYPES = Object.values(InvestmentType).map((key) => ({
  value: key,
  label: INVESTMENT_TYPE_LABELS[key as keyof typeof INVESTMENT_TYPE_LABELS]
}));

interface InvestmentModalProps {
  open: boolean;
  onClose: () => void;
  editInvestment: any;
}

const InvestmentModal: React.FC<InvestmentModalProps> = ({ open, onClose, editInvestment }) => {
  const {
    createInvestment,
    updateInvestment,
    accountBalance,
    fetchInvestmentsAndTransactions
  } = useInvestments();

  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [investmentType, setInvestmentType] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investmentDesc, setInvestmentDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const descInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && editInvestment) {
      setMode('edit');
      setInvestmentType(editInvestment.type || '');
      setInvestmentAmount(editInvestment.amount ? editInvestment.amount.toString() : '');
      setInvestmentDesc(editInvestment.description || '');
    } else if (open) {
      setMode('add');
      setInvestmentType('');
      setInvestmentAmount('');
      setInvestmentDesc('');
    }
    setError(null);
    setLoading(false);
  }, [open, editInvestment]);

  const handleAmountChange = createCurrencyInputHandler(setInvestmentAmount);

  const handleSaveInvestment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const investmentValue = parseCurrencyStringToNumber(investmentAmount);
      if (mode === 'add') {
        await createInvestment({
          type: investmentType,
          amount: investmentValue,
          description: investmentDesc,
          goalId: undefined,
          redeemed: undefined,
          expectedReturn: undefined,
          riskLevel: undefined
        });
      } else if (mode === 'edit' && editInvestment) {
        await updateInvestment(editInvestment.id, {
          type: investmentType,
          amount: investmentValue,
          description: investmentDesc
        });
      }
      onClose();
      await fetchInvestmentsAndTransactions();
    } catch (err: any) {
      setError(err?.message || 'Erro ao salvar investimento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper open={open} onClose={onClose} title={mode === 'add' ? 'Novo Investimento' : 'Editar Investimento'} size="md">
      <form onSubmit={handleSaveInvestment} className="space-y-5 mt-2">
        {typeof accountBalance === 'number' && mode === 'add' && (
          <div>
            <span className="block text-gray-600 text-sm mb-1">Saldo disponível:</span>
            <span className="text-lg font-bold text-primary-700">
              R$ {accountBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        <div>
          <label className="block text-md font-bold text-primary-700 mb-1" htmlFor="investmentType">Tipo *</label>
          <select
            id="investmentType"
            value={investmentType}
            onChange={e => setInvestmentType(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-primary-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-700 bg-white-50"
            disabled={loading}
            required
          >
            <option value="">Selecione</option>
            {INVESTMENT_TYPES.map(opt => (
              <option key={String(opt.value)} value={String(opt.value)}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-md font-bold text-primary-700 mb-1" htmlFor="investmentAmount">Valor *</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white-800">R$</span>
            <input
              type="text"
              id="investmentAmount"
              value={investmentAmount}
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
          <label className="block text-md font-bold text-primary-700 mb-1" htmlFor="investmentDesc">Descrição <span className="text-sm font-medium text-white-800">(opcional)</span></label>
          <input
            type="text"
            id="investmentDesc"
            value={investmentDesc}
            onChange={e => setInvestmentDesc(e.target.value)}
            ref={descInputRef}
            placeholder="Descrição do investimento"
            className="w-full px-4 py-3 rounded-lg border border-primary-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-700"
            disabled={loading}
            maxLength={100}
          />
        </div>
        <div className="flex gap-4 pt-4">
          <Button type="submit" variant="active" className="w-full py-3" disabled={loading}>
            {loading ? 'Salvando...' : mode === 'add' ? 'Investir' : 'Atualizar'}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default InvestmentModal;
