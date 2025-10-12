import React from 'react';
import ModalWrapper from 'shared/components/ui/ModalWrapper';
import Button from 'shared/components/ui/Button';
import type { InvestmentDTO } from 'shared/dtos/Investment.dto';

interface RedeemModalProps {
  open: boolean;
  onClose: () => void;
  investmentToRedeem: InvestmentDTO | null;
  onConfirm: () => void;
}

const RedeemModal: React.FC<RedeemModalProps> = ({
  open,
  onClose,
  investmentToRedeem,
  onConfirm
}) => {
  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Resgatar Investimento"
      size="md"
    >
      <p className="mb-6">
        Deseja resgatar o investimento <strong>{investmentToRedeem?.description}</strong> no valor de{' '}
        <strong>R$ {investmentToRedeem?.amount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>?
      </p>
      <div className="flex gap-4">
        <Button variant="warning" className="flex-1" onClick={onConfirm}>
          Confirmar Resgate
        </Button>
        <Button variant="secondary" className="flex-1" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </ModalWrapper>
  );
};

export default RedeemModal;