import React from 'react';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Registre os componentes necessários do Chart.js
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);



const data = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Investimentos (R$)',
      data: [1200, 1500, 1800, 2000, 2200, 2500, 2700],
      fill: false,
      backgroundColor: '#2563eb',
      borderColor: '#2563eb',
      tension: 0.4,
    },
  ],
};

const barData = {
  labels: ['Ações', 'Tesouro', 'Fundos', 'CDB'],
  datasets: [
    {
      label: 'Distribuição',
      data: [1500, 1000, 500, 700],
      backgroundColor: [
        '#2563eb',
        '#059669',
        '#f59e42',
        '#ef4444',
      ],
    },
  ],
};

export default function InvestmentCharts() {
  return (
    <div className="investment-chart-container mb-8">
      <h3 className="investment-section-title mb-4">Evolução dos Investimentos</h3>
      <Line data={data} />
      <h3 className="investment-section-title mt-8 mb-4">Distribuição por Tipo</h3>
      <Bar data={barData} />
    </div>
  );
}