import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import '../investments-styles.css';

// Registre os elementos necessários do Chart.js
Chart.register(ArcElement, Tooltip, Legend);

const total = 50000;
const rendaFixa = 36000;
const rendaVariavel = 14000;

const data = {
  labels: [
    'Fundos de investimento',
    'Tesouro Direto',
    'Previdência Privada',
    'Bolsa de Valores',
  ],
  datasets: [
    {
      data: [18000, 12000, 8000, 12000],
      backgroundColor: [
        '#2563eb', // azul
        '#f59e42', // laranja
        '#a21caf', // roxo
        '#ef4444', // vermelho
      ],
      borderWidth: 0,
    },
  ],
};

const options = {
  plugins: {
    legend: { display: false },
  },
  cutout: '70%',
};

export default function Investments() {
  return (
    <div className="pt-8 pl-8 pr-4 max-w-4xl w-full">
      <div className="bg-white rounded-xl shadow p-8">
        <h2 className="font-bold text-xl mb-2">Investimentos</h2>
        <div className="text-lg mb-6">
          Total: <span className="font-bold text-primary-700">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex gap-4 mb-6">
          <div className="flex-1 bg-primary-700 rounded-lg p-4 text-center text-white-50">
            <div className="font-medium mb-1">Renda Fixa</div>
            <div className="text-xl font-bold">R$ {rendaFixa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="flex-1 bg-primary-700 rounded-lg p-4 text-center text-white-50">
            <div className="font-medium mb-1">Renda variável</div>
            <div className="text-xl font-bold">R$ {rendaVariavel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          </div>
        </div>
        <div>
          <div className="font-medium mb-2">Estatísticas</div>
          <div className="bg-primary-700 rounded-lg p-4 flex flex-row items-center justify-center">
            <div style={{ maxWidth: 180 }}>
              <Doughnut data={data} options={options} />
            </div>
            <div className="flex flex-col gap-2 text-sm mt-2 ml-8 investment-legend-text">
              <div className="flex items-center gap-2">
                <span style={{ background: '#2563eb', width: 12, height: 12, borderRadius: 6, display: 'inline-block' }} />
                Fundos de investimento
              </div>
              <div className="flex items-center gap-2">
                <span style={{ background: '#f59e42', width: 12, height: 12, borderRadius: 6, display: 'inline-block' }} />
                Tesouro Direto
              </div>
              <div className="flex items-center gap-2">
                <span style={{ background: '#a21caf', width: 12, height: 12, borderRadius: 6, display: 'inline-block' }} />
                Previdência Privada
              </div>
              <div className="flex items-center gap-2">
                <span style={{ background: '#ef4444', width: 12, height: 12, borderRadius: 6, display: 'inline-block' }} />
                Bolsa de Valores
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}