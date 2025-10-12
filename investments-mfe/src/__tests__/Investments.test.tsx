import { render, screen } from '@testing-library/react';
import InvestmentsApp from '../App';

describe('InvestmentsApp', () => {
  it('deve renderizar o componente principal', () => {
    render(<InvestmentsApp />);
    expect(screen.getByText(/investimentos/i)).toBeInTheDocument();
  });
});
