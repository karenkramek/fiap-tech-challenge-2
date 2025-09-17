import React from 'react';
import { Menu, User } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  // For now, we'll use a static name. Later this could be fetched from API
  const name = 'Usuário';

  return (
    <header className='bg-primary-700 text-white-50 shadow-md'>
      <div className='container mx-auto px-4 py-3 flex justify-between items-center'>
        <div className='flex items-center space-x-4'>
          {/* Botão do Hambúrguer - visível apenas em telas menores que md */}
          <button onClick={toggleSidebar} className='xl:hidden lg:block hover:bg-primary-600 p-1 rounded'>
            <Menu className='h-6 w-6 header-icon' />
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className='text-xl font-bold transition-colors header-link'
          >
            ByteBank
          </button>
        </div>
        <div className='flex items-center space-x-2'>
          <span className='text-sm hidden md:block header-text'>{name}</span>
          <div className='h-8 w-8 rounded-full border-2 border-secondary-200 bg-secondary-200 flex items-center justify-center text-black-400'>
            <User className='h-4 w-4' />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;