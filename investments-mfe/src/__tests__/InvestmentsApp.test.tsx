import InvestmentsApp from '../App';
import { render, screen } from './test-utils';

// Mock de todos os serviços necessários
jest.mock('shared/services/InvestmentService', () => ({
  InvestmentService: {
    getAll: jest.fn().mockResolvedValue([]),
  }
}));

jest.mock('shared/services/TransactionService', () => ({
  TransactionService: {
    getAllTransactions: jest.fn().mockResolvedValue([]),
  }
}));

jest.mock('shared/services/AccountService', () => ({
  AccountService: {
    getAccountById: jest.fn().mockResolvedValue({ balance: 1000 }),
  }
}));

jest.mock('shared/services/GoalService', () => ({
  GoalService: {
    getAll: jest.fn().mockResolvedValue([]),
  }
}));

// Mock do FeedbackProvider
jest.mock('shared/components/ui/FeedbackProvider', () => {
  return function FeedbackProvider() {
    return <div data-testid="feedback-provider" />;
  };
});

describe('InvestmentsApp', () => {
  it('deve renderizar o título da página de investimentos', async () => {
    render(<InvestmentsApp />);

    // Aguarda o estado de carregamento passar
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();

    // Aguarda o componente carregar completamente
    await screen.findByText(/investimentos|dashboard|saldo/i, {}, { timeout: 3000 });
  });
});
