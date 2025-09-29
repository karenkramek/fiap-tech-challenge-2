import React from 'react';

interface GoalModalProps {
  showGoalModal: boolean;
  setShowGoalModal: (show: boolean) => void;
  goalName: string;
  setGoalName: (name: string) => void;
  goalDeadline: string;
  setGoalDeadline: (deadline: string) => void;
  savingGoal: string;
  setSavingGoal: (goal: string) => void;
  onConfirm: () => void;
}

const GoalModal: React.FC<GoalModalProps> = ({
  showGoalModal,
  setShowGoalModal,
  goalName,
  setGoalName,
  goalDeadline,
  setGoalDeadline,
  savingGoal,
  setSavingGoal,
  onConfirm,
}) => {
  if (!showGoalModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={() => setShowGoalModal(false)}
          aria-label="Fechar"
        >
          &times;
        </button>
        <h3 className="text-xl font-bold mb-4 text-primary-700">Criar Meta de Economia</h3>
        
        <form onSubmit={(e) => { e.preventDefault(); onConfirm(); }} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="goalName">Nome da meta</label>
            <input
              id="goalName"
              type="text"
              className="w-full border rounded px-3 py-2"
              value={goalName}
              onChange={e => setGoalName(e.target.value)}
              placeholder="Ex: Viagem para Europa"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="savingGoal">Valor da meta (R$)</label>
            <input
              id="savingGoal"
              type="number"
              className="w-full border rounded px-3 py-2"
              value={savingGoal}
              onChange={e => setSavingGoal(e.target.value)}
              min={1}
              step="0.01"
              placeholder="0,00"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="goalDeadline">Data limite (opcional)</label>
            <input
              id="goalDeadline"
              type="date"
              className="w-full border rounded px-3 py-2"
              value={goalDeadline}
              onChange={e => setGoalDeadline(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              className="bg-primary-700 text-white-50 px-6 py-2 rounded-lg font-semibold shadow hover:bg-primary-800 transition flex-1"
            >
              Criar Meta
            </button>
            <button
              type="button"
              className="bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-gray-500 transition flex-1"
              onClick={() => setShowGoalModal(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;