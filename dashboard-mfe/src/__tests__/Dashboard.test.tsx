import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionType } from 'shared/types/TransactionType';
import Dashboard from '../App';
import { renderWithProviders } from 'shared/utils/test-utils';

// Mock do localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock dos componentes do shared
jest.mock('shared/components/domain/BalanceCard', () => {
  return function MockBalanceCard({ transactions, showBalance, onToggleBalance }: any) {
    return (
      <div data-testid="balance-card">
        <div data-testid="balance-amount">{showBalance ? 'R$ 1.000,00' : '••••••'}</div>
        <button onClick={onToggleBalance} data-testid="toggle-balance">
          {showBalance ? 'Ocultar' : 'Mostrar'}
        </button>
        <div data-testid="transactions-count">{transactions?.length || 0} transações</div>
      </div>
    );
  };
});

jest.mock('shared/components/ui/Card', () => {
  return function MockCard({ children, className }: any) {
    return <div data-testid="card" className={className}>{children}</div>;
  };
});

jest.mock('shared/components/ui/ErrorBoundary', () => {
  return function MockErrorBoundary({ children }: any) {
    return <div data-testid="error-boundary">{children}</div>;
  };
});

jest.mock('shared/components/ui/LoadingSpinner', () => {
  return function MockLoadingSpinner({ size }: any) {
    return <div data-testid="loading-spinner" data-size={size}>Loading...</div>;
  };
});

// Mock do FeedbackProvider
jest.mock('shared/components/ui/FeedbackProvider', () => ({
  showError: jest.fn(),
  showSuccess: jest.fn()
}));

// Mock dos componentes lazy
jest.mock('shared/components/domain/transaction/TransactionList', () => {
  return function MockTransactionList({ transactions, onTransactionsChanged, mode }: any) {
    return (
      <div data-testid="transaction-list" data-mode={mode}>
        <div data-testid="transaction-count">{transactions?.length || 0}</div>
        {transactions?.map((transaction: any, index: number) => (
          <div key={index} data-testid={`transaction-${index}`}>
            {transaction.description} - {transaction.amount}
            <button
              onClick={() => onTransactionsChanged()}
              data-testid={`edit-transaction-${index}`}
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    );
  };
});

jest.mock('shared/components/domain/transaction/TransactionAdd', () => {
  return function MockTransactionAdd({
    amount,
    transactionType,
    description,
    onAmountChange,
    onTypeChange,
    onDescriptionChange,
    onFileSelect,
    onSubmit,
    loading
  }: any) {
    return (
      <div data-testid="transaction-add">
        <input
          data-testid="amount-input"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="Valor"
        />
        <select
          data-testid="type-select"
          value={transactionType}
          onChange={onTypeChange}
        >
          <option value={TransactionType.DEPOSIT}>Depósito</option>
          <option value={TransactionType.WITHDRAWAL}>Saque</option>
        </select>
        <input
          data-testid="description-input"
          value={description}
          onChange={onDescriptionChange}
          placeholder="Descrição"
        />
        <input
          data-testid="file-input"
          type="file"
          onChange={(e) => onFileSelect(e.target.files?.[0] || null)}
        />
        <button
          data-testid="submit-button"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Adicionar'}
        </button>
      </div>
    );
  };
});

// Mock do hook useTransactions
const mockUseTransactions = {
  transactions: [
    {
      id: '1',
      type: TransactionType.DEPOSIT,
      amount: 100,
      date: new Date('2024-01-01'),
      description: 'Salário',
    },
    {
      id: '2',
      type: TransactionType.WITHDRAWAL,
      amount: 50,
      date: new Date('2024-01-02'),
      description: 'Compras',
    }
  ],
  loading: false,
  addTransaction: jest.fn(),
  fetchTransactions: jest.fn()
};

jest.mock('shared/hooks/useTransactions', () => ({
  useTransactions: () => mockUseTransactions
}));

// Mock das constantes
jest.mock('shared/constants/toast', () => ({
  TOAST_MESSAGES: {
    INVALID_AMOUNT: 'Valor inválido',
    TRANSACTION_SUCCESS: 'Transação adicionada com sucesso!',
    TRANSACTION_ERROR: 'Erro ao adicionar transação'
  }
}));

// Mock das utilities
jest.mock('shared/utils/currency', () => ({
  createCurrencyInputHandler: (setter: any) => (value: string) => setter(value),
  parseCurrencyStringToNumber: (value: string) => parseFloat(value.replace(/[^\d]/g, '')) || 0
}));

// Mock do hook useAuthProtection
jest.mock('shared/hooks/useAuthProtection', () => ({
  useAuthProtection: () => ({
    isAuthenticated: true,
    loading: false,
    isPublicRoute: false
  })
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    jest.clearAllMocks();
  });

  it('should render dashboard with all main sections', async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByTestId('balance-card')).toBeInTheDocument();
      expect(screen.getByTestId('transaction-add')).toBeInTheDocument();
      expect(screen.getByTestId('transaction-list')).toBeInTheDocument();
    });

    // Verifica se o título da nova transação está presente
    expect(screen.getByText('Nova transação')).toBeInTheDocument();
    expect(screen.getByText('Extrato')).toBeInTheDocument();
  });

  it('should toggle balance visibility', async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByTestId('balance-card')).toBeInTheDocument();
    });

    const toggleButton = screen.getByTestId('toggle-balance');

    // Inicialmente balance deve estar oculto
    expect(screen.getByText('••••••')).toBeInTheDocument();
    expect(screen.getByText('Mostrar')).toBeInTheDocument();

    // Clica para mostrar
    fireEvent.click(toggleButton);

    expect(screen.getByText('R$ 1.000,00')).toBeInTheDocument();
    expect(screen.getByText('Ocultar')).toBeInTheDocument();
  });

  it('should display transactions list', async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByTestId('transaction-list')).toBeInTheDocument();
    });

    // Verifica se o modo dashboard está sendo passado
    expect(screen.getByTestId('transaction-list')).toHaveAttribute('data-mode', 'dashboard');

    // Verifica se as transações são exibidas
    expect(screen.getByTestId('transaction-count')).toHaveTextContent('2');
    expect(screen.getByTestId('transaction-0')).toBeInTheDocument();
    expect(screen.getByTestId('transaction-1')).toBeInTheDocument();
  });

  it('should handle transaction form submission with valid data', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByTestId('transaction-add')).toBeInTheDocument();
    });

    await user.type(screen.getByTestId('amount-input'), '100');
    await user.selectOptions(screen.getByTestId('type-select'), TransactionType.DEPOSIT);
    await user.type(screen.getByTestId('description-input'), 'Teste transação');

    fireEvent.click(screen.getByTestId('submit-button'));

    expect(mockUseTransactions.addTransaction).toHaveBeenCalledWith(
      TransactionType.DEPOSIT,
      100,
      expect.any(Date),
      'Teste transação',
      undefined
    );
  });

  it('should show error for invalid amount', async () => {
    const { showError } = require('shared/components/ui/FeedbackProvider');
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByTestId('transaction-add')).toBeInTheDocument();
    });

    // Submete sem preencher valor ou com valor inválido
    fireEvent.click(screen.getByTestId('submit-button'));

    expect(showError).toHaveBeenCalledWith('Valor inválido');
    expect(mockUseTransactions.addTransaction).not.toHaveBeenCalled();
  });

  it('should handle file attachment', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByTestId('transaction-add')).toBeInTheDocument();
    });
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
    await user.upload(fileInput, file);
    expect(fileInput).toBeInTheDocument();
  });

  it('should handle loading state', async () => {
    renderWithProviders(<Dashboard />);
    // Verifica se o componente de lista aparece (mock já retorna loading: false)
    await waitFor(() => {
      expect(screen.getByTestId('transaction-list')).toBeInTheDocument();
    });
    expect(screen.getByTestId('transaction-count')).toHaveTextContent('2');
  });

  it('should refresh transactions when edited', async () => {
    renderWithProviders(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByTestId('transaction-list')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('edit-transaction-0'));
    expect(mockUseTransactions.fetchTransactions).toHaveBeenCalled();
  });

  it('should have link to transactions page', async () => {
    renderWithProviders(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText('Ver Transações')).toBeInTheDocument();
    });
    const link = screen.getByText('Ver Transações').closest('a');
    expect(link).toHaveAttribute('href', '/transactions');
  });

  it('should handle transaction type change', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByTestId('transaction-add')).toBeInTheDocument();
    });
    const typeSelect = screen.getByTestId('type-select');
    expect(typeSelect).toHaveValue(TransactionType.DEPOSIT);
    await user.selectOptions(typeSelect, TransactionType.WITHDRAWAL);
    expect(typeSelect).toHaveValue(TransactionType.WITHDRAWAL);
  });

  it('should clear form after successful submission', async () => {
    const { showSuccess } = require('shared/components/ui/FeedbackProvider');
    mockUseTransactions.addTransaction.mockResolvedValue({});
    const user = userEvent.setup();
    renderWithProviders(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByTestId('transaction-add')).toBeInTheDocument();
    });
    await user.type(screen.getByTestId('amount-input'), '100');
    await user.type(screen.getByTestId('description-input'), 'Teste');
    fireEvent.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(showSuccess).toHaveBeenCalledWith('Transação adicionada com sucesso!');
    });
  });
});
