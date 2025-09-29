import React from 'react';

interface DeleteGoalModalProps {
  showDeleteModal: boolean;
  goalToDelete: number | null;
  goals: { name: string; saved: number }[];
  onConfirm: () => void;
  onClose: () => void;
}

const DeleteGoalModal: React.FC<DeleteGoalModalProps> = ({
  showDeleteModal,
  goalToDelete,
  goals,
  onConfirm,
  onClose
}) => {
  if (!showDeleteModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4 text-red-600">Excluir Meta</h3>
        <p className="mb-6">
          Tem certeza que deseja excluir a meta{' '}
          <strong>{goalToDelete !== null ? goals[goalToDelete]?.name : ''}</strong>?
          {goalToDelete !== null && goals[goalToDelete]?.saved > 0 && (
            <span className="block mt-2 text-green-600 font-semibold">
              O valor de R$ {goals[goalToDelete]?.saved?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}{' '}
              será devolvido ao seu saldo.
            </span>
          )}
        </p>
        <div className="flex gap-4">
          <button
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold flex-1"
            onClick={onConfirm}
          >
            Confirmar Exclusão
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

export default DeleteGoalModal;