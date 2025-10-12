import { render, screen, fireEvent } from '@testing-library/react';
import BadgeSuggestions from '../BadgeSuggestions';

describe('BadgeSuggestions (shared)', () => {
  it('não renderiza se suggestions estiver vazio', () => {
    const { container } = render(<BadgeSuggestions suggestions={[]} onSelect={jest.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renderiza sugestões e chama onSelect ao clicar', () => {
    const onSelect = jest.fn();
    render(<BadgeSuggestions suggestions={["Meta1", "Meta2"]} onSelect={onSelect} />);
    const btn = screen.getByRole('button', { name: /meta1/i });
    fireEvent.click(btn);
    expect(onSelect).toHaveBeenCalledWith('Meta1');
    expect(screen.getByRole('button', { name: /meta2/i })).toBeInTheDocument();
  });

  it('deve ser acessível', () => {
    render(<BadgeSuggestions suggestions={["Acessível"]} onSelect={() => {}} />);
    expect(screen.getByRole('button', { name: /acessível/i })).toBeInTheDocument();
  });
});
