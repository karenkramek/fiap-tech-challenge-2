import React from 'react';
import { Bar } from 'react-chartjs-2';

interface InflowsOutflowsCardProps {
  entradaSaidaData: any;
  entradaSaidaOptions: any;
  entradas: number;
  saidas: number;
}

const InflowsOutflowsCard: React.FC<InflowsOutflowsCardProps> = ({
  entradaSaidaData,
  entradaSaidaOptions,
  entradas,
  saidas,
}) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center min-h-[420px]">
    <h2 className="text-lg font-bold text-primary-700 mb-4 text-center">Entradas vs Saídas</h2>
    <div className="w-full flex flex-col items-center" style={{ height: 220 }}>
      <Bar data={entradaSaidaData} options={entradaSaidaOptions} />
    </div>
    <div className="flex flex-col sm:flex-row justify-between w-full mt-4 text-base font-semibold gap-2">
      <span className="flex items-center gap-2 text-green-700">
        <span className="inline-block w-3 h-3 rounded-full bg-green-500" />
        Entradas: R$ {entradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </span>
      <span className="flex items-center gap-2 text-red-700">
        <span className="inline-block w-3 h-3 rounded-full bg-red-500" />
        Saídas: R$ {saidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </span>
    </div>
  </div>
);

export default InflowsOutflowsCard;