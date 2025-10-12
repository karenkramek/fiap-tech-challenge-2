import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { useInvestments } from '../hooks/useInvestments';

jest.mock('shared/services/InvestmentService', () => ({
  InvestmentService: {
    getAll: jest.fn().mockResolvedValue([
      { id: '1', name: 'CDB', amount: 1000 },
      { id: '2', name: 'Tesouro', amount: 500 }
    ])
  }
}));
jest.mock('shared/services/TransactionService', () => ({
  TransactionService: {
    getAllTransactions: jest.fn().mockResolvedValue([])
  }
}));
jest.mock('shared/services/AccountService', () => ({
  AccountService: {
    getAccountById: jest.fn().mockResolvedValue({ balance: 1500 })
  }
}));
jest.mock('react-redux', () => ({
  useSelector: () => ({ id: 'user1' })
}));

describe('useInvestments', () => {
  it('retorna lista de investimentos e saldo', async () => {
    const { result } = renderHook(() => useInvestments());
    // Aguarda o useEffect
    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.investments).toHaveLength(2);
    expect(result.current.accountBalance).toBe(1500);
  });
});
