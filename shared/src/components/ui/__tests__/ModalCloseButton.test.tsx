import { render, fireEvent } from '@testing-library/react';
import ModalCloseButton from '../ModalCloseButton';

describe('ModalCloseButton (shared)', () => {
  it('renderiza o botão', () => {
    const { getByRole } = render(<ModalCloseButton onClick={() => {}} />);
    expect(getByRole('button')).toBeInTheDocument();
  });

  it('chama onClick ao clicar', () => {
    const onClick = jest.fn();
    const { getByRole } = render(<ModalCloseButton onClick={onClick} />);
    fireEvent.click(getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });

  it('acessibilidade: tem aria-label', () => {
    const { getByLabelText } = render(<ModalCloseButton onClick={() => {}} />);
    expect(getByLabelText(/fechar/i)).toBeInTheDocument();
  });
});
