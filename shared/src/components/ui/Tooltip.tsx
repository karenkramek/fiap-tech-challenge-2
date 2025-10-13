import React, { ReactNode, useState } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  disabled?: boolean | undefined;
}

/**
 * Componente Tooltip simples que exibe uma mensagem ao passar o mouse
 */
const Tooltip: React.FC<TooltipProps> = ({ content, children, disabled = false }) => {
  const [visible, setVisible] = useState(false);

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          className="absolute z-50 px-3 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg whitespace-pre-line text-center -top-14 left-1/2 transform -translate-x-1/2 pointer-events-none"
          role="tooltip"
        >
          {content}
          <div className="absolute w-2 h-2 bg-gray-800 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2"></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
