import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Investment } from 'shared/models/Investment';
import { InvestmentService } from 'shared/services/InvestmentService';
import { RootState } from 'shared/store';

export const useRedeemInvestment = (showMessage: (msg: string) => void) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [investmentToRedeem, setInvestmentToRedeem] = useState<Investment | null>(null);

  const openRedeemModal = (inv: Investment) => {
    setInvestmentToRedeem(inv);
    setShowRedeemModal(true);
  };

  const closeRedeemModal = () => {
    setShowRedeemModal(false);
    setInvestmentToRedeem(null);
  };

  // Atualizado para operar sobre o array global de investments
  const handleRedeemInvestment = async () => {
    if (!investmentToRedeem) return;
    if (!user?.id) return;
    try {
      // Remove investimento do array global
      await InvestmentService.remove(investmentToRedeem.id);

      // Atualiza saldo da conta via InvestmentService
      const account = await InvestmentService.getAccountById(user.id);
      if (!account) return;
      await InvestmentService.updateAccountBalance(account.id, account.balance + (investmentToRedeem.amount || 0));

      showMessage('Investimento resgatado com sucesso!');
      closeRedeemModal();
      window.dispatchEvent(new CustomEvent('userDataChanged', {
        detail: { userId: user.id, type: 'investment-redeemed' }
      }));
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
