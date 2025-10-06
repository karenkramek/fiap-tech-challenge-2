import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Investment } from '../../types/investments';

interface PortfolioChartProps {
  investments: Investment[];
}

export const PortfolioChart: React.FC<PortfolioChartProps> = ({ investments }) => {
  const chartData = React.useMemo(() => {
    const typeGroups = investments.reduce((acc, inv) => {
      acc[inv.type] = (acc[inv.type] || 0) + inv.amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: Object.keys(typeGroups),
      datasets: [{
        data: Object.values(typeGroups),
        backgroundColor: [
          '#3B82F6', // FUNDOS
          '#10B981', // TESOURO
          '#F59E0B', // PREVIDENCIA
          '#EF4444', // ACOES
          '#8B5CF6'  // CDB
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    };
  }, [investments]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: R$ ${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="h-64">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};