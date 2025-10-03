import React from 'react';
import { Scatter } from 'react-chartjs-2';

interface RiskReturnCardProps {
  scatterData: any;
  scatterOptions: any;
  riskReturnData: { label: string; risk: number; return: number; color: string }[];
}

const RiskReturnCard: React.FC<RiskReturnCardProps> = ({
  scatterData,
  scatterOptions,
  riskReturnData,
}) => (
  <div className="bg-primary-700 rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center min-h-[420px]">
    <h2 className="text-lg font-semibold text-white mb-2 w-full text-center">Risco vs Retorno</h2>
    <div className="w-full flex flex-col items-center" style={{ minHeight: 220 }}>
      <div style={{ width: 320, height: 220 }}>
        <Scatter data={scatterData} options={scatterOptions} />
      </div>
    </div>
    <div className="w-full mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {riskReturnData.map(item => (
          <div key={item.label} className="flex items-center gap-2 text-white text-base">
            <span
              style={{
                background: item.color,
                width: 18,
                height: 18,
                borderRadius: 9,
                display: 'inline-block'
              }}
            />
            {item.label}
            <span className="ml-2 text-xs text-white">
              (Risco: {item.risk}, Retorno: {item.return}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default RiskReturnCard;