import React from 'react';
import { X } from 'lucide-react';

interface SidebarProps {
  isSidebarOpen?: boolean;
  toggleSidebar?: () => void;
  currentPath?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen = false,
  toggleSidebar = () => {},
  currentPath = '/'
}) => {

  const isActive = (path: string) => {
    return currentPath === path;
  };

  const handleNavigation = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
    toggleSidebar();
  };

  return (
    <>
      {/* Botão de fechar para o menu mobile */}
      {/* Visível apenas quando o menu está aberto */}
      {isSidebarOpen && (
        <div className="p-4 flex justify-end xl:hidden">
          <button
            onClick={toggleSidebar}
            className="hover:bg-white-600 p-2 rounded"
          >
            <X size={24} className="text-black-400" />
          </button>
        </div>
      )}

      {/* Navegação da Sidebar */}
      <nav className='p-4'>
        <ul className='space-y-2'>
          <li>
            <button
              onClick={() => handleNavigation('/dashboard')}
              className={`block py-2 px-4 transition-colors w-full text-left ${isActive('/dashboard')
                ? 'text-primary-700 font-bold bg-white-50 border-l-4 border-primary-700'
                : 'text-primary-700 hover:text-primary-700 hover:bg-white-50'}`}
            >
              Início
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation('/transactions')}
              className={`block py-2 px-4 transition-colors w-full text-left ${isActive('/transactions')
                ? 'text-primary-700 font-bold bg-white-50 border-l-4 border-primary-700'
                : 'text-primary-700 hover:text-primary-700 hover:bg-white-50'}`}
            >
              Transferências
            </button>
          </li>
          <li>
            <span className='block py-2 px-4 text-white-800 cursor-not-allowed opacity-60'>
              Investimentos
            </span>
          </li>
          <li>
            <span className='block py-2 px-4 text-white-800 cursor-not-allowed opacity-60'>
              Outros serviços
            </span>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;