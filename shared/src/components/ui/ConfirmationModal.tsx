import Button from "./Button";
import ModalWrapper from './ModalWrapper';

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
  showCancelButton?: boolean;
  confirmVariant?: 'danger' | 'warning' | 'success'; 
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
  size = 'sm',
  showCancelButton = true,
  confirmVariant = 'danger',
}: ConfirmationModalProps) {
  if (!open) return null;
  return (
    <ModalWrapper open={open} onClose={onCancel} title={title} size={size}>
      <div role="dialog" aria-modal="true" aria-label={title}>
        <p className="modal-text">{description}</p>
        <div className="flex justify-center space-x-3 mt-6">
          {showCancelButton && (
            <Button variant="secondary" onClick={onCancel} disabled={loading}>
              {cancelText}
            </Button>
          )}
          <Button variant={confirmVariant} onClick={onConfirm} disabled={loading}>
            {loading ? 'Excluindo...' : confirmText}
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
}

export default ConfirmationModal;
