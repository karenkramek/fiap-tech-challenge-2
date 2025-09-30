import React from 'react';

interface ModalCloseButtonProps {
  onClick: () => void;
  className?: string;
  ariaLabel?: string;
}

const ModalCloseButton: React.FC<ModalCloseButtonProps> = ({ onClick, className = '', ariaLabel = 'Fechar' }) => (
  <button
    className={`absolute top-3 right-3 bg-white-50 text-gray-400 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center focus:outline-none z-10 ${className}`}
    onClick={onClick}
    aria-label={ariaLabel}
    type="button"
  >
    ×
  </button>
);

export default ModalCloseButton;
