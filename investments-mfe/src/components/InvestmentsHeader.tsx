import React from 'react';
import Card from 'shared/components/ui/Card';
import InvestmentsTotalsRow from './InvestmentsTotalsRow';

const InvestmentsHeader: React.FC = () => {
  return (
    <Card>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-primary-700">Investimentos</h1>
        <span className="text-primary-800 text-base mb-2">
          Acompanhe seus investimentos, crie novas metas e visualize o desempenho das suas aplicações financeiras. Utilize o gráfico para analisar suas movimentações.
        </span>
        <div className="w-full flex flex-col items-center mt-8 my-2">
            <InvestmentsTotalsRow />
        </div>
      </div>
    </Card>
  );
};

export default InvestmentsHeader;
