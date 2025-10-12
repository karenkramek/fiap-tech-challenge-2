import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { createScatterData, scatterOptions, riskReturnData } from '../../config/chartConfigs';

const RiskReturnCard: React.FC = () => {
  const scatterData = createScatterData();

  return (
    <div className="bg-primary-600 rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center min-h-[420px]">
      <h2 className="text-lg font-semibold text-white mb-2 w-full text-center">Risco vs Retorno</h2>
      <div className="w-full flex flex-col items-center" style={{ minHeight: 240 }}>
        <div style={{ width: 340, height: 240 }}>
          <Scatter data={scatterData} options={scatterOptions} />
        </div>
        <div className="flex flex-col gap-3 min-w-[240px] mt-6">
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
};

export default RiskReturnCard;