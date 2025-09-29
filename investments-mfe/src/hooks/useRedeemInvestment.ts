import { useState } from 'react';
import axios from 'axios';

const accountId = 'acc001';

export const useRedeemInvestment = (fetchData: () => void, showMessage: (msg: string) => void) => {
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [investmentToRedeem, setInvestmentToRedeem] = useState<any>(null);

  const openRedeemModal = (inv: any) => {
    setInvestmentToRedeem(inv);
    setShowRedeemModal(true);
  };

  const closeRedeemModal = () => {
    setShowRedeemModal(false);
    setInvestmentToRedeem(null);
  };

  const handleRedeemInvestment = async () => {
    if (!investmentToRedeem) return;
    
    try {
      const res = await axios.get(`http://localhost:3034/accounts?id=${accountId}`);
      const account = res.data && res.data[0];
      if (!account) return;

      const updatedInvestments = (account.investments || []).filter(
        inv => inv.id !== investmentToRedeem.id
      );

      await axios.patch(`http://localhost:3034/accounts/${account.id}`, {
        investments: updatedInvestments,
        balance: account.balance + (investmentToRedeem.amount || 0)
      });

      showMessage('Investimento resgatado com sucesso!');
      closeRedeemModal();
      fetchData();
    } catch (error) {
      console.error('Erro ao resgatar investimento:', error);
      showMessage('Erro ao resgatar investimento. Tente novamente.');
    }
  };

  return {
    showRedeemModal,
    investmentToRedeem,
    openRedeemModal,
    closeRedeemModal,
    handleRedeemInvestment
  };
};