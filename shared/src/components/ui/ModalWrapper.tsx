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
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay">
      <div
        ref={modalRef}
        className={`relative bg-white-50 rounded-xl shadow-lg w-full ${sizeClasses[size]} mx-4 p-6 ${className}`}
      >
        <ModalCloseButton onClick={onClose} />
        {title && <h2 className="text-xl font-semibold text-primary-700 mb-4 pr-8">{title}</h2>}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default ModalWrapper;
