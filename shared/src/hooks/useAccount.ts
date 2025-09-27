'use client';

import { useCallback, useEffect, useState } from 'react';
import { Account } from '../models/Account';
import { AccountService } from '../services/AccountService';

export function useAccount() {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentUser, setCurrentUser] = useState(AccountService.getCurrentUser());

  const fetchAccount = useCallback(async () => {
    try {
      setLoading(true);

      // Obter o usuário atual do localStorage
      const currentUser = AccountService.getCurrentUser();
      if (!currentUser) {
        // Se não há usuário logado, limpar conta
        setAccount(null);
        setError(null);
        return;
      }

      // Buscar a conta específica do usuário logado
      const data = await AccountService.getAccountById(currentUser.id);
      setAccount(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch account'));
      // Do not set a default value for account when an error occurs.
      setAccount(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const loggedAccount = await AccountService.login(email, password);
      setAccount(loggedAccount);
      setCurrentUser(AccountService.getCurrentUser());
      return loggedAccount;
    } catch (err) {
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    AccountService.logout();
    setCurrentUser(null);
    setAccount(null);
  }, []);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  // Atualizar currentUser quando localStorage mudar (ex: em outras abas)
  useEffect(() => {
    const handleStorageChange = () => {
      const newUser = AccountService.getCurrentUser();
      if (newUser?.id !== currentUser?.id) {
        setCurrentUser(newUser);
        fetchAccount(); // Recarregar conta quando usuário mudar
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Verificar mudanças locais também (no mesmo tab)
    const interval = setInterval(() => {
      const newUser = AccountService.getCurrentUser();
      if (newUser?.id !== currentUser?.id) {
        setCurrentUser(newUser);
        fetchAccount();
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [currentUser, fetchAccount]);

  return {
    account,
    loading,
    error,
    currentUser,
    isAuthenticated: AccountService.isAuthenticated(),
    login,
    logout,
    refreshAccount: fetchAccount
  };
}
