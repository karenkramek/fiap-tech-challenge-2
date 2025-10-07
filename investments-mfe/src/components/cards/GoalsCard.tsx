import React, { useRef } from 'react';

interface Goal {
  name: string;
  value: number;
  deadline?: string;
  saved: number;
}

interface GoalsCardProps {
  savingGoal: string;
  setSavingGoal: (v: string) => void;
  handleSaveGoal: () => void;
  goals: Goal[];
  depositValues: string[];
  setDepositValues: React.Dispatch<React.SetStateAction<string[]>>;
  withdrawValues: string[];
  setWithdrawValues: React.Dispatch<React.SetStateAction<string[]>>;
  handleDeposit: (idx: number) => void;
  handleWithdraw: (idx: number) => void;
  openDeleteGoalModal: (idx: number) => void;
}

const GoalsCard: React.FC<GoalsCardProps> = ({
  savingGoal,
  setSavingGoal,
  handleSaveGoal,
  goals,
  depositValues,
  setDepositValues,
  withdrawValues,
  setWithdrawValues,
  handleDeposit,
  handleWithdraw,
  openDeleteGoalModal,
}) => {
  const depositInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center min-h-[420px] mt-8 w-full">
      <h2 className="text-lg font-bold text-primary-700 mb-4 text-center">Metas</h2>
      <div className="w-full flex flex-col gap-4">
        <form
          className="bg-green-50 rounded p-4 flex flex-col sm:flex-row gap-2 items-stretch sm:items-end"
          onSubmit={e => { e.preventDefault(); handleSaveGoal(); }}
          aria-label="Nova Meta de Economia"
        >
          <div className="flex-1 flex flex-col">
            <label htmlFor="meta-valor" className="text-green-800 font-semibold mb-1">Valor da Meta</label>
            <input
              id="meta-valor"
              type="number"
              className="border rounded px-2 py-2 w-full text-base"
              placeholder="Defina sua meta (R$)"
              value={savingGoal}
              onChange={e => setSavingGoal(e.target.value)}
              min={1}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white rounded px-4 py-2 font-semibold mt-2 sm:mt-0 sm:ml-2 hover:bg-green-700 transition"
          >
            Salvar Meta
          </button>
        </form>
      </div>
      {goals.length > 0 && (
        <div className="w-full mt-6 flex flex-col gap-4">
          {goals.map((goal, idx) => {
            const percent = Math.min(100, (goal.saved / goal.value) * 100);
            let progressColor = 'bg-red-500';
            if (percent >= 80) progressColor = 'bg-green-500';
            else if (percent >= 40) progressColor = 'bg-yellow-400';

            return (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 flex flex-col gap-3 shadow transition">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1 gap-2">
                  <span className="font-semibold text-green-800">{goal.name}</span>
                  <div className="flex items-center gap-2">
                    {goal.deadline && (
                      <span className="text-xs text-gray-500">Prazo: {goal.deadline}</span>
                    )}
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition"
                      onClick={() => openDeleteGoalModal(idx)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between text-xs text-gray-700 mb-1 gap-2">
                  <span>Poupado: R$ {goal.saved.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  <span>Meta: R$ {goal.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="relative w-full bg-gray-100 rounded h-8 overflow-hidden mb-1">
                  <div
                    className={`${progressColor} h-8 rounded transition-all duration-500 flex items-center`}
                    style={{ width: `${percent}%`, minWidth: percent > 0 ? '2.5rem' : 0 }}
                  >
                    <span
                      className="text-xs font-bold text-white pl-2"
                      style={{
                        position: 'absolute',
                        left: percent > 10 ? `${percent / 2}%` : '8px',
                        color: percent > 10 ? '#fff' : '#333',
                        transition: 'left 0.3s'
                      }}
                    >
                      {percent.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <input
                    ref={depositInputRef}
                    type="number"
                    min={1}
                    className="border rounded px-2 py-2 w-full sm:w-1/2 text-base"
                    placeholder="Depositar"
                    value={depositValues[idx] || ''}
                    onChange={e => setDepositValues(values => {
                      const arr = [...values];
                      arr[idx] = e.target.value;
                      return arr;
                    })}
                    aria-label={`Depositar na meta ${goal.name}`}
                  />
                  <button
                    className="bg-green-600 text-white rounded px-3 py-2 hover:bg-green-700 transition w-full sm:w-auto"
                    onClick={() => handleDeposit(idx)}
                    aria-label={`Depositar na meta ${goal.name}`}
                  >
                    Depositar
                  </button>
                  <input
                    type="number"
                    min={1}
                    className="border rounded px-2 py-2 w-full sm:w-1/2 text-base"
                    placeholder="Sacar"
                    value={withdrawValues[idx] || ''}
                    onChange={e => setWithdrawValues(values => {
                      const arr = [...values];
                      arr[idx] = e.target.value;
                      return arr;
                    })}
                    aria-label={`Sacar da meta ${goal.name}`}
                  />
                  <button
                    className="bg-yellow-500 text-white rounded px-3 py-2 hover:bg-yellow-600 transition w-full sm:w-auto"
                    onClick={() => handleWithdraw(idx)}
                    aria-label={`Sacar da meta ${goal.name}`}
                  >
                    Sacar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <span className="text-xs text-gray-400 mt-4 text-center">
        Adicione e acompanhe suas metas de economia.
      </span>
      {/* O modal de meta pode ser extraído para outro componente futuramente */}
    </div>
  );
};

export default GoalsCard;