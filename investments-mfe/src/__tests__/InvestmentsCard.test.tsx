import InvestmentsCard from '../components/cards/InvestmentsCard';
import { render, screen } from './test-utils';

// Mock do hook useInvestments
jest.mock('../hooks/useInvestments', () => ({
  useInvestments: () => ({
    investments: [
      { id: '1', name: 'CDB', amount: 1000, type: 'FUND' },
      { id: '2', name: 'Tesouro', amount: 500, type: 'TREASURY' }
    ]
  })
}));

// Mock dos componentes UI
jest.mock('shared/components/ui/Card', () => {
  return function Card({ children, className }: any) {
    return <div className={className}>{children}</div>;
  };
});

jest.mock('shared/components/ui/Button', () => {
  return function Button({ children, onClick, ...props }: any) {
    return <button onClick={onClick} {...props}>{children}</button>;
  };
});

jest.mock('shared/components/ui/ConfirmationModal', () => {
  return function ConfirmationModal() {
    return <div data-testid="confirmation-modal" />;
  };
});

jest.mock('../components/modals/InvestmentModal', () => {
  return function InvestmentModal() {
    return <div data-testid="investment-modal" />;
  };
});

// Mock dos serviços
jest.mock('shared/services/TransactionService', () => ({
  TransactionService: {
    redeemAllInvestments: jest.fn(),
  }
}));

// Mock das funções de feedback
jest.mock('shared/components/ui/FeedbackProvider', () => ({
  showSuccess: jest.fn(),
  showError: jest.fn(),
}));

describe('InvestmentsCard', () => {
  it('exibe o título do card de investimentos', () => {
    render(<InvestmentsCard />);
    expect(screen.getByText(/Investimentos/i)).toBeInTheDocument();
  });

  it('exibe o botão de novo investimento', () => {
    render(<InvestmentsCard />);
    expect(screen.getByText(/Novo Investimento/i)).toBeInTheDocument();
  });
});
