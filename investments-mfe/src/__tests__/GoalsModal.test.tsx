import userEvent from '@testing-library/user-event';
import GoalsModal from '../components/modals/GoalsModal';
import { render, screen } from './test-utils';

// Mock dos utilitários de moeda
jest.mock('shared/utils/currency', () => ({
  parseCurrencyStringToNumber: jest.fn((value: string) => {
    return parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
  }),
  createCurrencyInputHandler: jest.fn((setter) => (e: any) => {
    setter(e.target.value);
  }),
  formatCurrencyWithoutSymbol: jest.fn((value: number) => value.toString()),
}));

// Mock do componente BadgeSuggestions
jest.mock('shared/components/ui/BadgeSuggestions', () => {
  return function BadgeSuggestions() {
    return <div data-testid="badge-suggestions" />;
  };
});

// Mock do ModalWrapper
jest.mock('shared/components/ui/ModalWrapper', () => {
  return function ModalWrapper({
    children,
    open,
    onClose
  }: {
    children: React.ReactNode;
    open: boolean;
    onClose: () => void;
  }) {
    if (!open) return null;
    return (
      <div data-testid="modal-wrapper">
        <button onClick={onClose} aria-label="fechar">X</button>
        {children}
      </div>
    );
  };
});

describe('GoalsModal', () => {
  it('abre, preenche e salva uma nova meta', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    const onSave = jest.fn();

    render(<GoalsModal open={true} onClose={onClose} onSave={onSave} />);

    // Preencher campos - usando labels para ser mais específico
    const nameInput = screen.getByLabelText(/nome/i);
    const valueInput = screen.getByPlaceholderText('00,00');

    await user.type(nameInput, 'Viajar');
    await user.type(valueInput, '5000');

    // Submeter
    const saveButton = screen.getByRole('button', { name: /adicionar/i });
    await user.click(saveButton);

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Viajar',
        value: expect.any(Number)
      })
    );
  });

  it('fecha o modal ao clicar em cancelar', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(<GoalsModal open={true} onClose={onClose} onSave={jest.fn()} />);

    const cancelButton = screen.getByRole('button', { name: /fechar/i });
    await user.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('deve garantir acessibilidade nos botões principais', () => {
    render(<GoalsModal open={true} onClose={jest.fn()} onSave={jest.fn()} />);

    // Botão de fechar/modal deve ter label acessível
    const cancelButton = screen.getByRole('button', { name: /fechar/i });
    expect(cancelButton).toBeInTheDocument();

    // Botão de submit deve ser acessível
    const saveButton = screen.getByRole('button', { name: /adicionar/i });
    expect(saveButton).toBeInTheDocument();
  });
});
