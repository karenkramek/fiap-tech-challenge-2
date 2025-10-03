'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import type { AccountData } from '../store/authSlice';
import { login as loginThunk, logout as logoutAction } from '../store/authSlice';

export function useAccount(): {
  account: AccountData | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  currentUser: AccountData | null;
  login: (email: string, password: string) => Promise<AccountData | undefined>;
  logout: () => void;
  refreshAccount: () => Promise<void>;
} {
  const dispatch: AppDispatch = useDispatch();
  const account = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const loading = useSelector((state: RootState) => state.auth.loading);
  const error = useSelector((state: RootState) => state.auth.error);

  const login = async (email: string, password: string): Promise<AccountData | undefined> => {
    try {
      const result = await dispatch(loginThunk({ email, password })).unwrap();
      return result as AccountData;
    } catch (err) {
      return undefined;
    }
  };

  const logout = () => {
    dispatch(logoutAction());
    localStorage.removeItem('authUser');
  };

  // Implementar se necessário: buscar dados atualizados do usuário
  const refreshAccount = async () => {
    // Exemplo buscar o saldo real e dados do usuário diretamente do backend
    // Exemplo: dispatch(fetchAccountThunk())
    return Promise.resolve();
  };

  return {
    account,
    loading,
    error,
    isAuthenticated,
    currentUser: account,
    login,
    logout,
    refreshAccount,
  };
}
