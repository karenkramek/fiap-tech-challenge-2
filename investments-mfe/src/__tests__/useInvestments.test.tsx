import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useInvestments } from '../hooks/useInvestments';

// Mock dos serviços
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

// Store mock para testes
const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: (state = { user: { id: 'user1' } }) => state,
    },
    preloadedState: {
      auth: { user: { id: 'user1' } },
    },
  });
};

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const store = createTestStore();
  return <Provider store={store}>{children}</Provider>;
};

describe('useInvestments', () => {
  it('retorna lista de investimentos e saldo', async () => {
    const { result } = renderHook(() => useInvestments(), { wrapper });

    // Aguarda o useEffect processar
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.investments).toHaveLength(2);
    expect(result.current.accountBalance).toBe(1500);
  });
});
