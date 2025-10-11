import Button from "./Button";
import ModalWrapper from './ModalWrapper';

// Modal de confirmação reutilizável
interface ConfirmationModalProps {
  open: boolean;
  title: string;
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

function ConfirmationModal({
  open,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  loading = false,
  size = 'sm', // Novo default
}: ConfirmationModalProps) {
  if (!open) return null;
  return (
    <ModalWrapper open={open} onClose={onCancel} title={title} size={size}>
      <p className="modal-text">{description}</p>
      <div className="flex justify-center space-x-3 mt-6">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          {cancelText}
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={loading}>
          {loading ? 'Excluindo...' : confirmText}
        </Button>
      </div>
    </ModalWrapper>
  );
}

export default ConfirmationModal;
