import { Menu } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
// @ts-ignore
import { useAccount } from 'shared/hooks/useAccount';

interface HeaderProps {
  toggleSidebar: () => void;
  showAuthButtons?: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, showAuthButtons = false }) => {
  const { account, loading } = useAccount();

  // Função para gerar iniciais do nome
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Função para gerar email fictício baseado no nome
  const generateEmail = (name: string): string => {
    const cleanName = name.toLowerCase().replace(/\s+/g, '.');
    return `${cleanName}@bytebank.com.br`;
  };

  // Informações do usuário baseadas na conta
  const user = account ? {
    name: account.name,
    email: generateEmail(account.name),
    initials: getInitials(account.name)
  } : null;

  return (
    <header className='bg-primary-700 text-white-50 shadow-md'>
      <div className='container mx-auto px-4 py-3 flex justify-between items-center'>
        <div className='flex items-center space-x-4'>
          <button onClick={toggleSidebar} className='xl:hidden lg:block hover:bg-primary-600 p-1 rounded'>
            <Menu className='h-6 w-6 header-icon' />
          </button>
          <Link
            to="/"
            className='text-xl font-bold transition-colors header-link'
          >
            ByteBank
          </Link>
        </div>

        {/* Botões de Conta e Login - apenas quando showAuthButtons for true (tela inicial) */}
        {showAuthButtons && (
          <div className='flex items-center space-x-3'>
            <button className='bg-white text-primary-700 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors font-medium text-sm'>
              Crie uma conta
            </button>
            <button className='border border-white text-white px-4 py-2 rounded-full hover:bg-white hover:text-primary-700 transition-colors font-medium text-sm'>
              Entre
            </button>
          </div>
        )}

        {/* Informações do usuário - quando NOT showAuthButtons (telas autenticadas) */}
        {!showAuthButtons && (
          <div className='flex items-center space-x-3'>
            {loading ? (
              <div className='flex items-center space-x-3'>
                <div className='hidden md:block text-right'>
                  <div className='h-4 w-20 bg-primary-600 rounded animate-pulse mb-1'></div>
                  <div className='h-3 w-32 bg-primary-600 rounded animate-pulse'></div>
                </div>
                <div className='w-10 h-10 bg-primary-600 rounded-full animate-pulse'></div>
              </div>
            ) : user ? (
              <>
                <div className='hidden md:block text-right'>
                  <p className='text-sm font-medium'>{user.name}</p>
                  <p className='text-xs text-primary-200'>{user.email}</p>
                </div>
                <button
                  className='flex items-center justify-center w-10 h-10 bg-primary-600 rounded-full border-2 border-white hover:bg-primary-500 transition-colors'
                  title={`Perfil de ${user.name}`}
                  onClick={() => console.log('Abrir menu do usuário')}
                >
                  <span className='text-sm font-bold text-white'>{user.initials}</span>
                </button>
              </>
            ) : (
              <div className='flex items-center space-x-3'>
                <div className='hidden md:block text-right'>
                  <p className='text-sm font-medium'>Usuário</p>
                  <p className='text-xs text-primary-200'>Carregando...</p>
                </div>
                <div className='w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center'>
                  <span className='text-sm font-bold text-white'>?</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
