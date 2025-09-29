import { useState } from 'react';

export const useGoalModal = (createGoal: (name: string, value: string, deadline: string) => Promise<void>) => {
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [savingGoal, setSavingGoal] = useState('');
  const [goalName, setGoalName] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');

  const handleSaveGoal = () => {
    setShowGoalModal(true);
  };

  const handleConfirmGoal = async () => {
    try {
      await createGoal(goalName, savingGoal, goalDeadline);
      setShowGoalModal(false);
      setGoalName('');
      setGoalDeadline('');
      setSavingGoal('');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao criar meta. Tente novamente.');
    }
  };

  const openDeleteGoalModal = (idx: number, setGoalToDelete: (idx: number) => void) => {
    setGoalToDelete(idx);
    setShowDeleteModal(true);
  };

  const closeDeleteGoalModal = (setGoalToDelete: (idx: number | null) => void) => {
    setShowDeleteModal(false);
    setGoalToDelete(null);
  };

  return {
    showGoalModal,
    setShowGoalModal,
    showDeleteModal,
    setShowDeleteModal,
    savingGoal,
    setSavingGoal,
    goalName,
    setGoalName,
    goalDeadline,
    setGoalDeadline,
    handleSaveGoal,
    handleConfirmGoal,
    openDeleteGoalModal,
    closeDeleteGoalModal
  };
};