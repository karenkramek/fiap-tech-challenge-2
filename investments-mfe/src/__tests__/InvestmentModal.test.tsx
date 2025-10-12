import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InvestmentModal from '../components/modals/InvestmentModal';

// Mock do hook useInvestments para simular criação de investimento
jest.mock('../../hooks/useInvestments', () => ({
  useInvestments: () => ({
    createInvestment: jest.fn().mockResolvedValue({ id: '1', name: 'CDB', amount: 1000 }),
    updateInvestment: jest.fn(),
    accountBalance: 2000,
    fetchInvestmentsAndTransactions: jest.fn(),
  })
}));

describe('InvestmentModal', () => {
  it('abre e fecha o modal de novo investimento', async () => {
    const onClose = jest.fn();
    render(<InvestmentModal open={true} onClose={onClose} editInvestment={null} />);
    expect(screen.getByText(/Novo Investimento/i)).toBeInTheDocument();
    const closeButton = screen.getByRole('button', { name: /fechar|close/i });
    await userEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });

  it('preenche e submete o formulário de novo investimento', async () => {
    const onClose = jest.fn();
    render(<InvestmentModal open={true} onClose={onClose} editInvestment={null} />);
    // Preencher campos
    const descInput = screen.getByPlaceholderText(/descrição/i);
    const amountInput = screen.getByPlaceholderText(/valor/i);
    const typeSelect = screen.getByRole('combobox');
    await userEvent.type(descInput, 'Investimento Teste');
    await userEvent.type(amountInput, '1000');
    await userEvent.selectOptions(typeSelect, screen.getAllByRole('option')[0]);
    // Submeter
    const submitButton = screen.getByRole('button', { name: /adicionar|salvar/i });
    await userEvent.click(submitButton);
    // Espera feedback e fechamento
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('deve exibir mensagem de erro ao tentar submeter sem preencher campos obrigatórios', async () => {
    const onClose = jest.fn();
    render(<InvestmentModal open={true} onClose={onClose} editInvestment={null} />);
    // Tenta submeter sem preencher nada
    const submitButton = screen.getByRole('button', { name: /adicionar|salvar/i });
    await userEvent.click(submitButton);
    // Espera mensagem de erro na tela
    expect(screen.getByText(/preencha todos os campos obrigatórios|valor inválido|campo obrigatório/i)).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('deve permitir valores extremos e exibir feedback', async () => {
    const onClose = jest.fn();
    render(<InvestmentModal open={true} onClose={onClose} editInvestment={null} />);
    // Preenche campos com valor extremo
    const descInput = screen.getByPlaceholderText(/descrição/i);
    const amountInput = screen.getByPlaceholderText(/valor/i);
    const typeSelect = screen.getByRole('combobox');
    await userEvent.type(descInput, 'Investimento Extremo');
    await userEvent.type(amountInput, '1000000000');
    await userEvent.selectOptions(typeSelect, screen.getAllByRole('option')[0]);
    const submitButton = screen.getByRole('button', { name: /adicionar|salvar/i });
    await userEvent.click(submitButton);
    // Espera feedback de sucesso ou fechamento
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('deve garantir acessibilidade nos botões principais', () => {
    render(<InvestmentModal open={true} onClose={jest.fn()} editInvestment={null} />);
    // Botão de fechar/modal deve ter label acessível
    const closeButton = screen.getByRole('button', { name: /fechar|close/i });
    expect(closeButton).toBeInTheDocument();
    // Botão de submit deve ser acessível
    const submitButton = screen.getByRole('button', { name: /adicionar|salvar/i });
    expect(submitButton).toBeInTheDocument();
  });
});
