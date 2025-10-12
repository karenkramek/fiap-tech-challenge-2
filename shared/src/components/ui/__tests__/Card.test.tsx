import { render, screen } from '@testing-library/react';
import Card from '../Card';

describe('Card (shared)', () => {
  it('renderiza com children', () => {
    render(<Card>Conteúdo do Card</Card>);
    expect(screen.getByText(/conteúdo do card/i)).toBeInTheDocument();
  });
});
