import { useCallback, useState } from 'react';

// Hook simples e reutilizável para controle de modal de metas
export function useGoalModal(initialOpen = false) {
  const [open, setOpen] = useState(initialOpen);
  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);
  return { open, openModal, closeModal };
}