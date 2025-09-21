import { Menu } from 'lucide-react';
import React from 'react';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
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

        {/* Botões de Conta e Login */}
        <div className='flex items-center space-x-3'>
          <button className='bg-white text-primary-700 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors font-medium text-sm'>
            Crie uma conta
          </button>
          <button className='border border-white text-white px-4 py-2 rounded-full hover:bg-white hover:text-primary-700 transition-colors font-medium text-sm'>
            Entre
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
