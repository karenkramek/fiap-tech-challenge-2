import { render, screen } from '@testing-library/react';
import InvestmentsApp from '../App';

describe('InvestmentsApp', () => {
  it('deve renderizar o título da página de investimentos', () => {
    render(<InvestmentsApp />);
    expect(screen.getByText(/investimentos/i)).toBeInTheDocument();
  });
});
