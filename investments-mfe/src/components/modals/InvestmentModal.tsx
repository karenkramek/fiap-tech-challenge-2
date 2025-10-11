import React, { useRef, useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import Button from 'shared/components/ui/Button';
import ModalWrapper from 'shared/components/ui/ModalWrapper';
import { createCurrencyInputHandler } from 'shared/utils/currency';
import { InvestmentType, INVESTMENT_TYPE_LABELS } from 'shared/types/InvestmentType';
import { useSelector } from 'react-redux';
import { RootState } from 'shared/store';
import { InvestmentService } from 'shared/services/InvestmentService';
import { parseCurrencyStringToNumber } from 'shared/utils/currency';
import type { InvestmentDTO } from 'shared/dtos/Investment.dto';
import { showSuccess, showError } from 'shared/components/ui/FeedbackProvider';

export const INVESTMENT_TYPES = Object.values(InvestmentType).map((key) => ({
  value: key,
  label: INVESTMENT_TYPE_LABELS[key as keyof typeof INVESTMENT_TYPE_LABELS]
}));

export type InvestmentModalHandle = {
  open: (investment?: InvestmentDTO) => void;
  close: () => void;
};

interface InvestmentModalProps {
  fetchInvestmentsAndTransactions: () => Promise<void>;
}

const InvestmentModal = forwardRef<InvestmentModalHandle, InvestmentModalProps>(({ fetchInvestmentsAndTransactions }, ref) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const accountId = useSelector((state: RootState) => state.auth.user?.id) || '';
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [investmentId, setInvestmentId] = useState<string | null>(null);
  const [investmentType, setInvestmentType] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investmentDesc, setInvestmentDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accountBalance, setAccountBalance] = useState<number | null>(null);
  const descInputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    open: (investment?: InvestmentDTO) => {
      if (investment) {
        setMode('edit');
        setInvestmentId(investment.id);
        setInvestmentType(investment.type || '');
        setInvestmentAmount(investment.amount ? investment.amount.toString() : '');
        setInvestmentDesc(investment.description || '');
      } else {
        setMode('add');
        setInvestmentId(null);
        setInvestmentType('');
        setInvestmentAmount('');
        setInvestmentDesc('');
      }
      setOpen(true);
      fetchAccountBalance();
    },
    close: () => setOpen(false)
  }));

  useEffect(() => {
    if (!open) {
      setError(null);
      setLoading(false);
    }
  }, [open]);

  const fetchAccountBalance = async () => {
    if (!user?.id) return;
    try {
      const account = await InvestmentService.getAccountById(user.id);
      setAccountBalance(account?.balance ?? null);
    } catch {
      setAccountBalance(null);
    }
  };

  const handleAmountChange = createCurrencyInputHandler(setInvestmentAmount);

  const handleSaveInvestment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!accountId) {
      setError('Usuário não autenticado');
      setLoading(false);
      return;
    }
    try {
      const account = await InvestmentService.getAccountById(accountId);
      if (!account) throw new Error('Conta não encontrada');
      const investmentValue = parseCurrencyStringToNumber(investmentAmount);
      if (mode === 'add' && account.balance < investmentValue) {
        setError('Saldo insuficiente para realizar o investimento.');
        setLoading(false);
        return;
      }
      if (mode === 'add') {
        const newInvestment: InvestmentDTO = {
          id: Math.random().toString(36).substring(2, 9),
          accountId,
          type: investmentType,
          amount: investmentValue,
          description: investmentDesc,
          date: new Date().toISOString(),
          goalId: undefined,
          redeemed: undefined,
          expectedReturn: undefined,
          riskLevel: undefined
        };
        await InvestmentService.create(newInvestment);
        await InvestmentService.updateAccountBalance(accountId, account.balance - investmentValue);
        showSuccess('Investimento criado!');
      } else if (mode === 'edit' && investmentId) {
        await InvestmentService.update(investmentId, {
          type: investmentType,
          amount: investmentValue,
          description: investmentDesc
        });
        showSuccess('Investimento atualizado!');
      }
      setOpen(false);
      setInvestmentType('');
      setInvestmentAmount('');
      setInvestmentDesc('');
      setError(null);
      await fetchInvestmentsAndTransactions();
    } catch (err: any) {
      setError(err?.message || 'Erro ao salvar investimento');
      showError('Erro ao salvar investimento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper open={open} onClose={() => setOpen(false)} title={mode === 'add' ? 'Novo Investimento' : 'Editar Investimento'} size="md">
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
});

export default InvestmentModal;
