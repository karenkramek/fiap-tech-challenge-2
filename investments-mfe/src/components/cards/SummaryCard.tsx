import React from 'react';
import { Doughnut } from 'react-chartjs-2';

interface SummaryCardProps {
  hasInvestments: boolean;
  total: number;
  rendaFixa: number;
  rendaVariavel: number;
  data: any;
  options: any;
  setShowModal: (show: boolean) => void;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  hasInvestments,
  total,
  rendaFixa,
  rendaVariavel,
  data,
  options,
  setShowModal,
}) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center min-h-[420px]">
    <h2 className="text-xl font-bold text-primary-700 mb-4">Resumo</h2>
    {!hasInvestments ? (
      <>
        <div className="flex flex-col items-center mt-6">
          <h3 className="text-lg font-bold text-primary-700 mb-2">
            Você ainda não possui investimentos
          </h3>
          <div className="my-4" aria-hidden="true">
            {/* SVG ilustrativo pode ser mantido aqui */}
          </div>
          <p className="text-sm text-gray-500 mb-4 text-center">
            Comece agora mesmo a investir e acompanhe seus resultados por aqui!
          </p>
        </div>
        <button
          className="transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-tertiary-300 px-4 text-base w-full py-3 bg-tertiary-600 hover:bg-tertiary-700 text-white-50 font-medium rounded-lg shadow-md mt-10"
          onClick={() => setShowModal(true)}
        >
          Novo Investimento
        </button>
      </>
    ) : (
      <>
        <div className="flex gap-6 mb-6 w-full justify-center">
          <div className="flex flex-col items-center">
            <span className="text-gray-500 text-sm">Total</span>
            <span className="text-2xl font-bold text-primary-700">
              {`R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gray-500 text-sm">Renda Fixa</span>
            <span className="text-lg font-semibold text-primary-700">
              {`R$ ${rendaFixa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gray-500 text-sm">Renda Variável</span>
            <span className="text-lg font-semibold text-primary-700">
              {`R$ ${rendaVariavel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            </span>
          </div>
        </div>
        <div className="w-full flex flex-col items-center">
          <span className="text-lg font-medium mb-2 text-center">Distribuição</span>
          <div className="flex flex-col md:flex-row items-center justify-center w-full">
            <div className="flex justify-center items-center w-full md:w-auto">
              <div style={{ width: 180, height: 180 }}>
                <Doughnut data={data} options={options} />
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm mt-4 md:mt-0 md:ml-8 items-start">
              <div className="flex items-center gap-2 text-gray-800">
                <span style={{ background: '#2563eb', width: 12, height: 12, borderRadius: 6, display: 'inline-block' }} />
                Fundos de investimento
              </div>
              <div className="flex items-center gap-2 text-gray-800">
                <span style={{ background: '#f59e42', width: 12, height: 12, borderRadius: 6, display: 'inline-block' }} />
                Tesouro Direto
              </div>
              <div className="flex items-center gap-2 text-gray-800">
                <span style={{ background: '#a21caf', width: 12, height: 12, borderRadius: 6, display: 'inline-block' }} />
                Previdência Privada
              </div>
              <div className="flex items-center gap-2 text-gray-800">
                <span style={{ background: '#ef4444', width: 12, height: 12, borderRadius: 6, display: 'inline-block' }} />
                Bolsa de Valores
              </div>
            </div>
          </div>
        </div>
        <button
          className="transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-tertiary-300 px-4 text-base w-full py-3 bg-tertiary-600 hover:bg-tertiary-700 text-white-50 font-medium rounded-lg shadow-md mt-10"
          onClick={() => setShowModal(true)}
        >
          Novo Investimento
        </button>
      </>
    )}
  </div>
);

export default SummaryCard;