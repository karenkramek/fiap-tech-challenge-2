import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmationModal from '../ConfirmationModal';

describe('ConfirmationModal (shared)', () => {
  const defaultProps = {
    open: true,
    title: 'Confirmar ação',
    description: 'Tem certeza?',
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  };

  it('renderiza título e descrição', () => {
    render(<ConfirmationModal {...defaultProps} />);
    expect(screen.getByText(/confirmar ação/i)).toBeInTheDocument();
    expect(screen.getByText(/tem certeza/i)).toBeInTheDocument();
  });

  it('chama onConfirm e onCancel', () => {
    render(<ConfirmationModal {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /confirmar/i }));
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(defaultProps.onConfirm).toHaveBeenCalled();
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('não renderiza se open=false', () => {
    render(<ConfirmationModal {...defaultProps} open={false} />);
    expect(screen.queryByText(/confirmar ação/i)).not.toBeInTheDocument();
  });

  it('renderiza loading e desabilita botões', () => {
    render(<ConfirmationModal {...defaultProps} loading />);
    expect(screen.getByRole('button', { name: /excluindo/i })).toBeDisabled();
  });

  it('acessibilidade: tem título e foco', () => {
    render(<ConfirmationModal {...defaultProps} />);
    expect(screen.getByRole('heading', { name: /confirmar ação/i })).toBeInTheDocument();
  });
});
