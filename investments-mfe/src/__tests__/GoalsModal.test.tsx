import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GoalsModal from '../components/modals/GoalsModal';

describe('GoalsModal', () => {
  it('abre, preenche e salva uma nova meta', async () => {
    const onClose = jest.fn();
    const onSave = jest.fn();
    render(<GoalsModal open={true} onClose={onClose} onSave={onSave} />);
    // Preencher campos
    const nameInput = screen.getByPlaceholderText(/nome da meta/i);
    const valueInput = screen.getByPlaceholderText(/valor/i);
    await userEvent.type(nameInput, 'Viajar');
    await userEvent.type(valueInput, '5000');
    // Submeter
    const saveButton = screen.getByRole('button', { name: /salvar|adicionar/i });
    await userEvent.click(saveButton);
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ name: 'Viajar', value: expect.any(Number) }));
  });

  it('fecha o modal ao clicar em cancelar', async () => {
    const onClose = jest.fn();
    render(<GoalsModal open={true} onClose={onClose} onSave={jest.fn()} />);
    const cancelButton = screen.getByRole('button', { name: /cancelar|fechar/i });
    await userEvent.click(cancelButton);
    expect(onClose).toHaveBeenCalled();
  });

  it('deve garantir acessibilidade nos botões principais', () => {
    render(<GoalsModal open={true} onClose={jest.fn()} onSave={jest.fn()} />);
    // Botão de fechar/modal deve ter label acessível
    const cancelButton = screen.getByRole('button', { name: /cancelar|fechar/i });
    expect(cancelButton).toBeInTheDocument();
    // Botão de submit deve ser acessível
    const saveButton = screen.getByRole('button', { name: /salvar|adicionar/i });
    expect(saveButton).toBeInTheDocument();
  });
});
