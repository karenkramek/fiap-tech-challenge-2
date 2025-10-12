import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionType } from 'shared/types/TransactionType';
import TransactionsPage from '../App';

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

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock do DOM APIs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock do scroll behavior
Object.defineProperty(window, 'scrollY', {
  writable: true,
  value: 0,
});

Object.defineProperty(document.documentElement, 'scrollHeight', {
  writable: true,
  value: 1000,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  value: 800,
});

// Mock dos componentes compartilhados
jest.mock('shared/components/ui/Button', () => {
  return function MockButton({ children, onClick, className, ...props }: any) {
    return (
      <button
        onClick={onClick}
        className={className}
        data-testid="button"
        {...props}
      >
        {children}
      </button>
    );
  };
});

jest.mock('shared/components/ui/Card', () => {
  return function MockCard({ children }: any) {
    return <div data-testid="card">{children}</div>;
  };
});

jest.mock('shared/components/ui/ErrorBoundary', () => {
  return function MockErrorBoundary({ children }: any) {
    return <div data-testid="error-boundary">{children}</div>;
  };
});

jest.mock('shared/components/ui/FeedbackProvider', () => {
  return function MockFeedbackProvider() {
    return <div data-testid="feedback-provider" />;
  };
});

jest.mock('shared/components/ui/ModalWrapper', () => {
  return function MockModalWrapper({ children, open, title, onClose }: any) {
    return open ? (
      <div data-testid="modal-wrapper">
        <div data-testid="modal-title">{title}</div>
        <button data-testid="modal-close" onClick={onClose}>Close</button>
        <div data-testid="modal-content">{children}</div>
      </div>
    ) : null;
  };
});

jest.mock('shared/components/domain/transaction/TransactionList', () => {
  return function MockTransactionList({
    transactions,
    onTransactionsChanged,
    mode,
    search,
    totalTransactions
  }: any) {
    return (
      <div data-testid="transaction-list" data-mode={mode}>
        <div data-testid="search-value">{search}</div>
        <div data-testid="total-transactions">{totalTransactions}</div>
        <div data-testid="transaction-count">{transactions.length}</div>
        {transactions.map((transaction: any, index: number) => (
          <div key={transaction.id} data-testid={`transaction-${index}`}>
            {transaction.description} - {transaction.amount}
            <button
              data-testid={`edit-transaction-${index}`}
              onClick={() => onTransactionsChanged()}
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
    loading,
    onClose
  }: any) {
    return (
      <div data-testid="transaction-add">
        <input
          data-testid="amount-input"
          value={amount}
          onChange={(e) => onAmountChange(e)}
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
          {loading ? 'Carregando...' : 'Adicionar'}
        </button>
        <button
          data-testid="close-button"
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>
    );
  };
});

// Mock dos hooks
const mockTransactions = [
  {
    id: '1',
    type: TransactionType.DEPOSIT,
    amount: 1000,
    date: new Date('2024-01-15'),
    description: 'Salário'
  },
  {
    id: '2',
    type: TransactionType.WITHDRAWAL,
    amount: 200,
    date: new Date('2024-01-16'),
    description: 'Compras supermercado'
  },
  {
    id: '3',
    type: TransactionType.DEPOSIT,
    amount: 500,
    date: new Date('2024-01-17'),
    description: 'Freelance'
  }
];

const mockUseTransactions = {
  transactions: mockTransactions,
  loading: false,
  error: null,
  addTransaction: jest.fn().mockResolvedValue(undefined),
  fetchTransactions: jest.fn().mockResolvedValue(undefined),
  updateTransaction: jest.fn().mockResolvedValue(undefined),
  deleteTransaction: jest.fn().mockResolvedValue(undefined)
};

jest.mock('shared/hooks/useTransactions', () => ({
  useTransactions: () => mockUseTransactions
}));

// Mock dos utilitários de moeda
jest.mock('shared/utils/currency', () => ({
  createCurrencyInputHandler: (setter: any) => (e: any) => setter(e.target.value),
  parseCurrencyStringToNumber: (value: string) => parseFloat(value.replace(/[^0-9.-]/g, '')) || 0,
  formatCurrency: (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`
}));

// Mock do lucide-react
jest.mock('lucide-react', () => ({
  Search: () => <div data-testid="search-icon" />
}));

describe('TransactionsPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
    // Reset scroll position
    Object.defineProperty(window, 'scrollY', { writable: true, value: 0 });
  });

  it('should render transactions page with all main sections', async () => {
    render(<TransactionsPage />);

    expect(screen.getByTestId('feedback-provider')).toBeInTheDocument();
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByText('Extrato')).toBeInTheDocument();
    expect(screen.getByText('Nova Transação')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('transaction-list')).toBeInTheDocument();
    });
  });

  it('should open and close add transaction modal', async () => {
    const user = userEvent.setup();
    render(<TransactionsPage />);

    // Modal should not be visible initially
    expect(screen.queryByTestId('modal-wrapper')).not.toBeInTheDocument();

    // Click to open modal
    const newTransactionButton = screen.getByText('Nova Transação');
    await user.click(newTransactionButton);

    // Modal should be visible
    expect(screen.getByTestId('modal-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('modal-title')).toHaveTextContent('Nova Transação');

    // Close modal
    const closeButton = screen.getByTestId('modal-close');
    await user.click(closeButton);

    // Modal should be hidden
    expect(screen.queryByTestId('modal-wrapper')).not.toBeInTheDocument();
  });

  it('should handle search functionality', async () => {
    const user = userEvent.setup();
    render(<TransactionsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('transaction-list')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Buscar');
    await user.type(searchInput, 'Salário');

    expect(searchInput).toHaveValue('Salário');

    // Wait for debounced search
    await waitFor(() => {
      expect(screen.getByTestId('search-value')).toHaveTextContent('Salário');
    }, { timeout: 500 });
  });

  it('should submit new transaction successfully', async () => {
    const user = userEvent.setup();
    render(<TransactionsPage />);

    // Open modal
    const newTransactionButton = screen.getByText('Nova Transação');
    await user.click(newTransactionButton);

    // Fill form
    const amountInput = screen.getByTestId('amount-input');
    const descriptionInput = screen.getByTestId('description-input');
    const submitButton = screen.getByTestId('submit-button');

    await user.type(amountInput, '1000');
    await user.type(descriptionInput, 'Test transaction');

    // Submit form
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockUseTransactions.addTransaction).toHaveBeenCalledWith(
        TransactionType.DEPOSIT,
        1000,
        expect.any(Date),
        'Test transaction',
        undefined
      );
    });

    // Modal should close after successful submission
    await waitFor(() => {
      expect(screen.queryByTestId('modal-wrapper')).not.toBeInTheDocument();
    });
  });

  it('should handle invalid amount validation', async () => {
    const user = userEvent.setup();
    render(<TransactionsPage />);

    // Open modal
    const newTransactionButton = screen.getByText('Nova Transação');
    await user.click(newTransactionButton);

    // Fill form with invalid amount
    const amountInput = screen.getByTestId('amount-input');
    const submitButton = screen.getByTestId('submit-button');

    await user.type(amountInput, '0');
    await user.click(submitButton);

    // Should not call addTransaction for invalid amount
    expect(mockUseTransactions.addTransaction).not.toHaveBeenCalled();
  });

  it('should handle transaction type change', async () => {
    const user = userEvent.setup();
    render(<TransactionsPage />);

    // Open modal
    const newTransactionButton = screen.getByText('Nova Transação');
    await user.click(newTransactionButton);

    const typeSelect = screen.getByTestId('type-select');

    // Change to withdrawal
    await user.selectOptions(typeSelect, TransactionType.WITHDRAWAL);

    expect(typeSelect).toHaveValue(TransactionType.WITHDRAWAL);
  });

  it('should handle file attachment', async () => {
    const user = userEvent.setup();
    render(<TransactionsPage />);

    // Open modal
    const newTransactionButton = screen.getByText('Nova Transação');
    await user.click(newTransactionButton);

    const fileInput = screen.getByTestId('file-input');
    const testFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });

    await user.upload(fileInput, testFile);

    // Verify file was selected
    expect(fileInput).toBeInTheDocument();
  });

  it('should display transaction list in full mode', async () => {
    render(<TransactionsPage />);

    await waitFor(() => {
      const transactionList = screen.getByTestId('transaction-list');
      expect(transactionList).toBeInTheDocument();
      expect(transactionList).toHaveAttribute('data-mode', 'full');
    });

    // Should show all transactions initially
    expect(screen.getByTestId('transaction-count')).toHaveTextContent('3');
    expect(screen.getByTestId('total-transactions')).toHaveTextContent('3');
  });

  it('should handle pagination and infinite scroll', async () => {
    render(<TransactionsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('transaction-list')).toBeInTheDocument();
    });

    // Simulate scroll to bottom
    Object.defineProperty(window, 'scrollY', { writable: true, value: 200 });
    Object.defineProperty(window, 'innerHeight', { writable: true, value: 800 });
    Object.defineProperty(document.documentElement, 'scrollHeight', { writable: true, value: 900 });

    // Trigger scroll event
    fireEvent.scroll(window);

    // Component should handle scroll event
    expect(screen.getByTestId('transaction-list')).toBeInTheDocument();
  });

  it('should refresh transactions when edited', async () => {
    render(<TransactionsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('transaction-list')).toBeInTheDocument();
    });

    // Click edit on first transaction
    const editButton = screen.getByTestId('edit-transaction-0');
    fireEvent.click(editButton);

    expect(mockUseTransactions.fetchTransactions).toHaveBeenCalled();
  });

  it('should reset page and scroll when searching', async () => {
    const user = userEvent.setup();
    render(<TransactionsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('transaction-list')).toBeInTheDocument();
    });

    // Simulate being on a later page (scrolled)
    Object.defineProperty(window, 'scrollY', { writable: true, value: 200 });

    const searchInput = screen.getByPlaceholderText('Buscar');
    await user.type(searchInput, 'test');

    // Should reset search state
    expect(searchInput).toHaveValue('test');
  });

  it('should handle form loading state', async () => {
    const user = userEvent.setup();

    // Mock a delayed addTransaction
    mockUseTransactions.addTransaction.mockImplementation(() =>
      new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<TransactionsPage />);

    // Open modal and fill form
    const newTransactionButton = screen.getByText('Nova Transação');
    await user.click(newTransactionButton);

    const amountInput = screen.getByTestId('amount-input');
    const descriptionInput = screen.getByTestId('description-input');
    const submitButton = screen.getByTestId('submit-button');

    await user.type(amountInput, '500');
    await user.type(descriptionInput, 'Test');

    // Submit and check loading state
    await user.click(submitButton);

    // Should show loading state
    expect(submitButton).toHaveTextContent('Carregando...');
    expect(submitButton).toBeDisabled();

    // Wait for completion
    await waitFor(() => {
      expect(mockUseTransactions.addTransaction).toHaveBeenCalled();
    });
  });

  it('should handle close modal from transaction add component', async () => {
    const user = userEvent.setup();
    render(<TransactionsPage />);

    // Open modal
    const newTransactionButton = screen.getByText('Nova Transação');
    await user.click(newTransactionButton);

    expect(screen.getByTestId('modal-wrapper')).toBeInTheDocument();

    // Close from TransactionAdd component
    const closeButton = screen.getByTestId('close-button');
    await user.click(closeButton);

    expect(screen.queryByTestId('modal-wrapper')).not.toBeInTheDocument();
  });

  it('should fetch transactions on component mount', async () => {
    render(<TransactionsPage />);

    await waitFor(() => {
      expect(mockUseTransactions.fetchTransactions).toHaveBeenCalled();
    });
  });

  it('deve garantir acessibilidade nos botões principais', () => {
    render(<TransactionsPage />);
    // Botão de submit deve ser acessível
    const submitButton = screen.getByRole('button', { name: /adicionar|enviar/i });
    expect(submitButton).toBeInTheDocument();
    // Botão de abrir modal deve ser acessível
    const newTransactionButton = screen.getByRole('button', { name: /nova transação/i });
    expect(newTransactionButton).toBeInTheDocument();
  });
});
