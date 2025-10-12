import { render, screen } from '@testing-library/react';
import InvestmentsCard from '../components/cards/InvestmentsCard';

const mockFetch = jest.fn();

jest.mock('../../hooks/useInvestments', () => ({
  useInvestments: () => ({
    investments: [
      { id: '1', name: 'CDB', amount: 1000, type: 'funds' },
      { id: '2', name: 'Tesouro', amount: 500, type: 'treasury' }
    ]
  })
}));

describe('InvestmentsCard', () => {
  it('exibe informações dos investimentos', () => {
    render(<InvestmentsCard fetchInvestmentsAndTransactions={mockFetch} />);
    expect(screen.getByText(/CDB/i)).toBeInTheDocument();
    expect(screen.getByText(/Tesouro/i)).toBeInTheDocument();
  });
});
