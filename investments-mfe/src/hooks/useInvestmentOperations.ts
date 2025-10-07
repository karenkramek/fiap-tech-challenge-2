import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from 'shared/store';

export const useInvestmentOperations = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [investmentType, setInvestmentType] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investmentDesc, setInvestmentDesc] = useState('');
  const [investmentToRedeem, setInvestmentToRedeem] = useState<any>(null);

  const handleInvestmentSubmit = async (
    e: React.FormEvent,
    accountBalance: number | null,
    setShowInsufficientFunds: (show: boolean) => void,
    setShowModal: (show: boolean) => void,
    fetchData: () => void
  ) => {
    e.preventDefault();
    if (!user?.id) return;
    const res = await axios.get(`http://localhost:3034/accounts?id=${user.id}`);
    const account = res.data && res.data[0];
    if (!account) return;

    const investmentValue = Number(investmentAmount);

    if (account.balance < investmentValue) {
      setShowInsufficientFunds(true);
      return;
    }

    const newInvestment = {
      id: Math.random().toString(36).substring(2, 9),
      type: investmentType,
      amount: investmentValue,
      description: investmentDesc,
      date: new Date().toISOString()
    };

    const updatedInvestments = [...(account.investments || []), newInvestment];
    const updatedBalance = account.balance - investmentValue;

    await axios.patch(`http://localhost:3034/accounts/${account.id}`, {
      investments: updatedInvestments,
      balance: updatedBalance
    });

    setShowModal(false);
    setInvestmentType('');
    setInvestmentAmount('');
    setInvestmentDesc('');
    fetchData();
  };

  const handleRedeemInvestment = async (
    investmentToRedeem: any,
    fetchData: () => void,
    setWidgetMessage: (msg: string) => void,
    closeRedeemModal: () => void
  ) => {
    if (!investmentToRedeem) return;
    if (!user?.id) return;
    const res = await axios.get(`http://localhost:3034/accounts?id=${user.id}`);
    const account = res.data && res.data[0];
    if (!account) return;

    const updatedInvestments = (account.investments || []).filter((inv: { id: string }) =>
      inv.id !== investmentToRedeem.id
    );
    const novoSaldo = account.balance + (investmentToRedeem.amount || 0);

    await axios.patch(`http://localhost:3034/accounts/${account.id}`, {
      investments: updatedInvestments,
      balance: novoSaldo
    });

    setWidgetMessage('Investimento resgatado com sucesso!');
    setTimeout(() => setWidgetMessage(''), 3000);
    closeRedeemModal();
    fetchData();
  };

  return {
    investmentType,
    setInvestmentType,
    investmentAmount,
    setInvestmentAmount,
    investmentDesc,
    setInvestmentDesc,
    investmentToRedeem,
    setInvestmentToRedeem,
    handleInvestmentSubmit,
    handleRedeemInvestment
  };
};