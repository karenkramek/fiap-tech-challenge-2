'use client';

import { useState, useEffect, useCallback } from 'react';
import { Account } from '../models/Account';
import { AccountService } from '../services/AccountService';

export function useAccount() {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAccount = useCallback(async () => {
    try {
      setLoading(true);
      const data = await AccountService.getAccount();
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

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  return { account, loading, error, refreshAccount: fetchAccount };
}
