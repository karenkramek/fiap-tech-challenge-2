import React from 'react';

interface RedeemModalProps {
  showRedeemModal: boolean;
  investmentToRedeem: any;
  onConfirm: () => void;
  onClose: () => void;
}

const RedeemModal: React.FC<RedeemModalProps> = ({
  showRedeemModal,
  investmentToRedeem,
  onConfirm,
  onClose
}) => {
  if (!showRedeemModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4 text-primary-700">Resgatar Investimento</h3>
        <p className="mb-6">
          Deseja resgatar o investimento <strong>{investmentToRedeem?.description}</strong> no valor de{' '}
          <strong>R$ {investmentToRedeem?.amount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>?
        </p>
        <div className="flex gap-4">
          <button
            className="bg-yellow-600 text-white px-6 py-2 rounded-lg font-semibold flex-1"
            onClick={onConfirm}
          >
            Confirmar Resgate
          </button>
          <button
            className="bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold flex-1"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RedeemModal;