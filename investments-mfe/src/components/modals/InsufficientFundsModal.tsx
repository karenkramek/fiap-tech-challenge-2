import React from 'react';
import ModalWrapper from 'shared/components/ui/ModalWrapper';
import Button from 'shared/components/ui/Button';

interface InsufficientFundsModalProps {
  open: boolean;
  onClose: () => void;
}

const InsufficientFundsModal: React.FC<InsufficientFundsModalProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <ModalWrapper open={open} onClose={onClose} title="Saldo Insuficiente" size="sm">
      <p className="mb-6">Você não possui saldo suficiente para este investimento.</p>
      <Button className="w-full" variant="danger" onClick={onClose}>
        Fechar
      </Button>
    </ModalWrapper>
  );
};

export default InsufficientFundsModal;