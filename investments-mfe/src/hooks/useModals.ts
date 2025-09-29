import { useState } from 'react';

export const useModals = () => {
  const [showModal, setShowModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [showInsufficientFunds, setShowInsufficientFunds] = useState(false);

  return {
    showModal,
    setShowModal,
    showGoalModal,
    setShowGoalModal,
    showDeleteModal,
    setShowDeleteModal,
    showRedeemModal,
    setShowRedeemModal,
    showInsufficientFunds,
    setShowInsufficientFunds
  };
};