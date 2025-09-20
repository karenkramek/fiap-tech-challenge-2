import React from "react";
import Button from "./Button";

// Modal de confirmação reutilizável
interface ConfirmationModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmationModal({
  open,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmationModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50 mt-0">
      <div className="modal-content">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
          onClick={onCancel}
          aria-label="Fechar"
        >
          ×
        </button>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-text">{description}</p>
        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Excluindo...' : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
