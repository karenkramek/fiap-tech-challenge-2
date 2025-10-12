import { render, screen } from '@testing-library/react';
import Button from '../Button';

describe('Button (shared)', () => {
  it('renderiza com texto e props', () => {
    render(<Button>Testar</Button>);
    expect(screen.getByRole('button', { name: /testar/i })).toBeInTheDocument();
  });

  it('chama onClick quando clicado', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Clique</Button>);
    screen.getByRole('button', { name: /clique/i }).click();
    expect(onClick).toHaveBeenCalled();
  });

  it('deve ser acessível', () => {
    render(<Button aria-label="Botão Acessível">Acessível</Button>);
    expect(screen.getByLabelText(/acessível/i)).toBeInTheDocument();
  });
});
