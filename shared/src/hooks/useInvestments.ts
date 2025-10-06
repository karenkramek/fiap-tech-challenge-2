import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { apiService, Investment } from '../services/api';

export const useInvestments = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  // Corrigir o selector para usar 'user' em vez de 'account'
  const account = useSelector((state: RootState) => state.auth.user);

  const fetchInvestments = async () => {
    if (!account?.id) return;

    try {
      setLoading(true);
      const data = await apiService.getInvestments(account.id);
      setInvestments(data);
    } catch (error) {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };

  const addInvestment = async (investment: Omit<Investment, 'id' | 'date'>) => {
    if (!account?.id) return;

    try {
      const newInvestment = await apiService.addInvestment(account.id, investment);

      // Notify other components of balance update
      window.dispatchEvent(new CustomEvent('balanceUpdated', { 
        detail: { 
          type: 'investment', 
          investment: newInvestment,
          accountId: account.id
        }
      }));
      
      await fetchInvestments();
      return newInvestment;
    } catch (error) {
      throw error;
    }
  };

  const redeemInvestment = async (investmentId: string) => {
    if (!account?.id) return;

    try {
      await apiService.redeemInvestment(account.id, investmentId);

      // Notify other components of balance update
      window.dispatchEvent(new CustomEvent('balanceUpdated', { 
        detail: { 
          type: 'redeem', 
          investmentId,
          accountId: account.id
        }
      }));
      
      await fetchInvestments();
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchInvestments();

    // Listen for balance update events
    const handleUpdate = () => {
      fetchInvestments();
    };
    
    window.addEventListener('balanceUpdated', handleUpdate);
    
    return () => window.removeEventListener('balanceUpdated', handleUpdate);
  }, [account?.id]);

  return {
    investments,
    loading,
    addInvestment,
    redeemInvestment,
    fetchInvestments
  };
};