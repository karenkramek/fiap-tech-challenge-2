import userEvent from '@testing-library/user-event';
import InvestmentModal from '../components/modals/InvestmentModal';
import { render, screen, waitFor } from './test-utils';

// Mock do hook useInvestments para simular criação de investimento
jest.mock('../hooks/useInvestments', () => ({
  useInvestments: () => ({
    createInvestment: jest.fn().mockResolvedValue({ id: '1', name: 'CDB', amount: 1000 }),
    updateInvestment: jest.fn(),
    accountBalance: 2000,
  })
}));

// Mock dos componentes UI
jest.mock('shared/components/ui/Button', () => {
  return function Button({ children, onClick, disabled, ...props }: any) {
    return (
      <button onClick={onClick} disabled={disabled} {...props}>
        {children}
      </button>
    );
  };
});

jest.mock('shared/components/ui/ModalWrapper', () => {
  return function ModalWrapper({
    children,
    open,
    onClose,
    title
  }: {
    children: React.ReactNode;
    open: boolean;
    onClose: () => void;
    title: string;
  }) {
    if (!open) return null;
    return (
      <div data-testid="modal-wrapper">
        <h2>{title}</h2>
        <button onClick={onClose} aria-label="fechar">X</button>
        {children}
      </div>
    );
  };
});

// Mock dos utilitários de moeda
jest.mock('shared/utils/currency', () => ({
  parseCurrencyStringToNumber: jest.fn((value: string) => {
    return parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
  }),
  createCurrencyInputHandler: jest.fn((setter) => (e: any) => {
    setter(e.target.value);
  }),
}));

// Mock dos tipos de investimento
jest.mock('shared/types/InvestmentType', () => ({
  InvestmentType: {
    FUND: 'FUND',
    TREASURY: 'TREASURY',
    PENSION: 'PENSION',
    STOCK: 'STOCK',
  },
  INVESTMENT_TYPE_LABELS: {
    FUND: 'Fundos de Investimento',
    TREASURY: 'Tesouro Direto',
    PENSION: 'Previdência Privada',
    STOCK: 'Bolsa de Valores',
  },
}));

describe('InvestmentModal', () => {
  it('abre e fecha o modal de novo investimento', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(<InvestmentModal open={true} onClose={onClose} editInvestment={null} />);

    expect(screen.getByText(/Novo Investimento/i)).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: /fechar/i });
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('preenche e submete o formulário de novo investimento', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(<InvestmentModal open={true} onClose={onClose} editInvestment={null} />);

    // Preencher campos
    const descInput = screen.getByPlaceholderText(/Descrição do investimento/i);
    const amountInput = screen.getByPlaceholderText(/00,00/i);
    const typeSelect = screen.getByRole('combobox');

    await user.type(descInput, 'Investimento Teste');
    await user.type(amountInput, '1000');
    await user.selectOptions(typeSelect, 'FUND');

    // Submeter
    const submitButton = screen.getByRole('button', { name: /investir/i });
    await user.click(submitButton);

    // Espera feedback e fechamento
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('deve garantir acessibilidade nos botões principais', () => {
    render(<InvestmentModal open={true} onClose={jest.fn()} editInvestment={null} />);

    // Botão de fechar/modal deve ter label acessível
    const closeButton = screen.getByRole('button', { name: /fechar/i });
    expect(closeButton).toBeInTheDocument();

    // Botão de submit deve ser acessível
    const submitButton = screen.getByRole('button', { name: /investir/i });
    expect(submitButton).toBeInTheDocument();
  });
});
