import React from 'react';

interface ModalCloseButtonProps {
  onClick: () => void;
  className?: string;
  ariaLabel?: string;
}

const ModalCloseButton: React.FC<ModalCloseButtonProps> = ({ onClick, className = '', ariaLabel = 'Fechar' }) => (
  <button
    className={`absolute top-2 right-2 sm:top-3 sm:right-3 bg-white-50 text-gray-400 hover:text-gray-700 active:text-gray-900 text-xl sm:text-2xl font-bold w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-300 rounded-full hover:bg-gray-100 transition-colors touch-manipulation z-10 ${className}`}
    onClick={onClick}
    aria-label={ariaLabel}
    type="button"
  >
    ×
  </button>
);

export default ModalCloseButton;
