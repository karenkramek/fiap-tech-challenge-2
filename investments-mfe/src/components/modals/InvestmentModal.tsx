import React from 'react';

interface InvestmentModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  accountBalance: number | null;
  investmentType: string;
  setInvestmentType: (type: string) => void;
  investmentAmount: string;
  setInvestmentAmount: (amount: string) => void;
  investmentDesc: string;
  setInvestmentDesc: (desc: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const InvestmentModal: React.FC<InvestmentModalProps> = ({
  showModal,
  setShowModal,
  accountBalance,
  investmentType,
  setInvestmentType,
  investmentAmount,
  setInvestmentAmount,
  investmentDesc,
  setInvestmentDesc,
  onSubmit,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={() => setShowModal(false)}
          aria-label="Fechar"
        >
          &times;
        </button>
        <h3 className="text-xl font-bold mb-4 text-primary-700">Novo Investimento</h3>
        <div className="mb-4">
          <span className="block text-gray-600 text-sm mb-1">Saldo disponível:</span>
          <span className="text-lg font-bold text-primary-700">
            {accountBalance !== null
              ? `R$ ${accountBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
              : 'Carregando...'}
          </span>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="investmentType">Tipo de investimento</label>
            <select
              id="investmentType"
              className="w-full border rounded px-3 py-2"
              value={investmentType}
              onChange={e => setInvestmentType(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              <option value="FUNDOS">Fundos de investimento</option>
              <option value="TESOURO">Tesouro Direto</option>
              <option value="PREVIDENCIA">Previdência Privada</option>
              <option value="BOLSA">Bolsa de Valores</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="investmentAmount">Valor</label>
            <input
              id="investmentAmount"
              type="number"
              className="w-full border rounded px-3 py-2"
              value={investmentAmount}
              onChange={e => setInvestmentAmount(e.target.value)}
              min={1}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="investmentDesc">Descrição</label>
            <input
              id="investmentDesc"
              type="text"
              className="w-full border rounded px-3 py-2"
              value={investmentDesc}
              onChange={e => setInvestmentDesc(e.target.value)}
              maxLength={100}
            />
          </div>
          <button
            type="submit"
            className="bg-primary-700 text-white-50 px-6 py-2 rounded-lg font-semibold shadow hover:bg-primary-800 transition mt-2"
          >
            Cadastrar investimento
          </button>
        </form>
      </div>
    </div>
  );
};

export default InvestmentModal;