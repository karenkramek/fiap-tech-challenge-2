import React from 'react';

interface InsufficientFundsModalProps {
  show: boolean;
  onClose: () => void;
}

const InsufficientFundsModal: React.FC<InsufficientFundsModalProps> = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4 text-red-600">Saldo Insuficiente</h3>
        <p className="mb-6">Você não possui saldo suficiente para este investimento.</p>
        <button
          className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold w-full"
          onClick={onClose}
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default InsufficientFundsModal;