import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'shared/store';
import { AccountService } from 'shared/services/AccountService';
import { TransactionService } from 'shared/services/TransactionService';
import { InvestmentService } from 'shared/services/InvestmentService';
import { Transaction } from 'shared/models/Transaction';
import type { InvestmentDTO } from 'shared/dtos/Investment.dto';
import { TransactionType } from 'shared/types/TransactionType';

export const useInvestments = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [investments, setInvestments] = useState<InvestmentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [accountBalance, setAccountBalance] = useState<number | null>(null);
  
  // Controle de modal
  const [investmentModalOpen, setInvestmentModalOpen] = useState(false);
  const [editInvestment, setEditInvestment] = useState<InvestmentDTO | null>(null);
  const [redeemModalOpen, setRedeemModalOpen] = useState(false);
  const [investmentToRedeem, setInvestmentToRedeem] = useState<InvestmentDTO | null>(null);

  const fetchInvestmentsAndTransactions = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      // Busca transações, investimentos globais e conta
      const [transactionsList, investmentsList, account] = await Promise.all([
        TransactionService.getAllTransactions(user.id),
        InvestmentService.getAll(user.id),
        AccountService.getAccountById(user.id)
      ]);
      setTransactions(transactionsList);
      setInvestments(investmentsList);
      setAccountBalance(account?.balance ?? null);
    } catch (error) {
      setTransactions([]);
      setInvestments([]);
      setAccountBalance(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInvestmentsAndTransactions(); }, [user?.id]);

  // CRUD de investimento
  const createInvestment = async (data: Omit<InvestmentDTO, 'id' | 'date' | 'accountId'> & { date?: string }) => {
    if (!user?.id) throw new Error('Usuário não autenticado');
    const newInvestment: InvestmentDTO = {
      id: Math.random().toString(36).substring(2, 9),
      accountId: user.id,
      ...data,
      date: data.date || new Date().toISOString(),
    };
    await InvestmentService.create(newInvestment);
    // Cria transação vinculada
    await TransactionService.addTransaction(
      user.id,
      TransactionType.INVESTMENT,
      newInvestment.amount,
      new Date(newInvestment.date),
      newInvestment.description,
      undefined,
      undefined,
      newInvestment.id
    );
    await fetchInvestmentsAndTransactions();
  };

  const updateInvestment = async (id: string, data: Partial<InvestmentDTO>) => {
    await InvestmentService.update(id, data);
    await fetchInvestmentsAndTransactions();
  };

  const removeInvestment = async (id: string) => {
    await InvestmentService.remove(id);
    await fetchInvestmentsAndTransactions();
  };

  // Resgate de investimento
  const openRedeemModal = (inv: InvestmentDTO) => {
    setInvestmentToRedeem(inv);
    setRedeemModalOpen(true);
  };
  const closeRedeemModal = () => {
    setRedeemModalOpen(false);
    setInvestmentToRedeem(null);
  };
  const handleRedeemInvestment = async (showMessage: (msg: string) => void) => {
    if (!investmentToRedeem || !user?.id) return;
    try {
      await InvestmentService.remove(investmentToRedeem.id);
      // Atualiza saldo da conta
      const account = await AccountService.getAccountById(user.id);
      if (!account) return;
      await AccountService.updateAccount(user.id, { balance: account.balance + (investmentToRedeem.amount || 0) });
      showMessage('Investimento resgatado com sucesso!');
      closeRedeemModal();
      await fetchInvestmentsAndTransactions();
    } catch (error) {
      showMessage('Erro ao resgatar investimento. Tente novamente.');
    }
  };

  // Controle de modal de investimento
  const openInvestmentModal = (inv?: InvestmentDTO) => {
    setEditInvestment(inv || null);
    setInvestmentModalOpen(true);
  };
  const closeInvestmentModal = () => {
    setEditInvestment(null);
    setInvestmentModalOpen(false);
  };

  return {
    transactions,
    investments,
    loading,
    accountBalance,
    setAccountBalance,
    fetchInvestmentsAndTransactions,
    // CRUD
    createInvestment,
    updateInvestment,
    removeInvestment,
    // Modal
    investmentModalOpen,
    openInvestmentModal,
    closeInvestmentModal,
    editInvestment,
    // Resgate
    redeemModalOpen,
    openRedeemModal,
    closeRedeemModal,
    investmentToRedeem,
    handleRedeemInvestment
  };
};