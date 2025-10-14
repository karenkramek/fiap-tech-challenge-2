import React, { useEffect, useRef } from 'react';
import ModalCloseButton from './ModalCloseButton';

interface ModalWrapperProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  open,
  onClose,
  title,
  children,
  className = '',
  size = 'md',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    // Bloquear scroll do body quando modal está aberto
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    // Focar no modal quando abrir (apenas na primeira vez)
    const focusModal = () => {
      if (modalRef.current) {
        modalRef.current.focus();
      }
    };

    // Usar setTimeout para garantir que o modal seja focado após render
    const timeoutId = setTimeout(focusModal, 0);

    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    // Fechar com ESC
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [open]); // Removido onClose da dependência para evitar re-execução

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center modal-overlay p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        ref={modalRef}
        className={`relative bg-white-50 rounded-xl shadow-lg w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto p-4 sm:p-6 ${className}`}
        tabIndex={-1}
        onFocus={(e) => {
          // Previne o refoco automático se já há um elemento focado dentro do modal
          if (modalRef.current && modalRef.current.contains(document.activeElement)) {
            e.preventDefault();
          }
        }}
      >
        <ModalCloseButton onClick={onClose} />
        {title && (
          <h2
            id="modal-title"
            className="text-lg sm:text-xl font-semibold text-primary-700 mb-4 pr-8"
          >
            {title}
          </h2>
        )}
        <div className="overflow-y-auto max-h-[calc(90vh-8rem)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalWrapper;
