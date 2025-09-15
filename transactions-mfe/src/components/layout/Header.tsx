'use client';

import { useAccount } from '@/hooks/useAccount';
import { Menu, User } from 'lucide-react';
import Link from 'next/link';
import React from 'react'; // Importe React para usar React.FC

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { account } = useAccount();
  const name = account?.name || 'Usuário';

  return (
    <header className='bg-primary-700 text-white-50 shadow-md'>
      <div className='container mx-auto px-4 py-3 flex justify-between items-center'>
        <div className='flex items-center space-x-4'>
          {/* Botão do Hambúrguer - visível apenas em telas menores que md */}
          <button onClick={toggleSidebar} className='xl:hidden lg:block hover:bg-primary-600 p-1 rounded'>
            <Menu className='h-6 w-6 header-icon' />
          </button>
          <Link href='/dashboard' className='text-xl font-bold transition-colors header-link'>
            ByteBank
          </Link>
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
