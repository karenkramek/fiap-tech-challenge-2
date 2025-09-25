import { LogOut, Menu } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
// @ts-ignore
import { useAccount } from 'shared/hooks/useAccount';
// @ts-ignore
import LoginModal from 'shared/components/LoginModal';
// @ts-ignore
import RegisterModal from 'shared/components/RegisterModal';
// @ts-ignore
import { AccountService } from 'shared/services/AccountService';

interface HeaderProps {
  toggleSidebar: () => void;
  showAuthButtons?: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, showAuthButtons = false }) => {
  const { account, loading, currentUser, login, logout, isAuthenticated } = useAccount();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const navigate = useNavigate();

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

  // Informações do usuário - usa currentUser se estiver logado, senão account padrão
  const user = currentUser ? {
    name: currentUser.name,
    email: currentUser.email,
    initials: getInitials(currentUser.name)
  } : (account ? {
    name: account.name,
    email: generateEmail(account.name),
    initials: getInitials(account.name)
  } : null);

  const handleLogin = async (email: string, password: string) => {
    try {
      const loggedAccount = await login(email, password);
      console.log('Login successful:', loggedAccount);

      // Redirecionar para dashboard após login bem-sucedido
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000); // Pequeno delay para mostrar o toast

    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Re-lança o erro para o modal tratar
    }
  };

  const handleLoginSuccess = (userInfo: { name: string; email: string }) => {
    toast.success(`Bem-vindo de volta, ${userInfo.name}!`, {
      duration: 4000,
      style: {
        background: '#059669',
        color: 'white',
      },
      iconTheme: {
        primary: 'white',
        secondary: '#059669',
      },
    });
  };

  const handleLogout = () => {
    logout();
    toast.success('Logout realizado com sucesso!', {
      duration: 3000,
      style: {
        background: '#0369a1',
        color: 'white',
      },
      iconTheme: {
        primary: 'white',
        secondary: '#0369a1',
      },
    });
    // Redirecionar para home após logout
    navigate('/');
  };

  const handleEnterClick = () => {
    // Se já estiver logado, vai direto para o dashboard
    if (isAuthenticated && currentUser) {
      navigate('/dashboard');
    } else {
      // Senão, abre o modal de login
      setLoginModalOpen(true);
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      const newAccount = await AccountService.createAccount(name, email, password);
      console.log('Account created successfully:', newAccount);

      // Toast adicional personalizado para cadastro
      toast.success(`Conta criada para ${name}!`, {
        duration: 4000,
        style: {
          background: '#0d9488',
          color: 'white',
        },
        iconTheme: {
          primary: 'white',
          secondary: '#0d9488',
        },
      });

    } catch (error) {
      console.error('Error creating account:', error);

      // Toast de erro personalizado
      toast.error('Erro ao criar conta. Tente novamente.', {
        duration: 4000,
        style: {
          background: '#dc2626',
          color: 'white',
        },
        iconTheme: {
          primary: 'white',
          secondary: '#dc2626',
        },
      });

      throw error; // Re-lançar o erro para o modal tratar
    }
  };

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
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => setRegisterModalOpen(true)}
                  className='bg-white text-primary-700 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors font-medium text-sm'
                >
                  Crie uma conta
                </button>
                <button
                  onClick={handleEnterClick}
                  className='border border-white text-white px-4 py-2 rounded-full hover:bg-white hover:text-primary-700 transition-colors font-medium text-sm'
                >
                  Entre
                </button>
              </>
            ) : (
              <button
                onClick={handleEnterClick}
                className='bg-tertiary-600 hover:bg-tertiary-700 text-white px-4 py-2 rounded-full transition-colors font-medium text-sm'
              >
                Ir para Dashboard
              </button>
            )}
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
                <div className='flex items-center space-x-2'>
                  <button
                    className='flex items-center justify-center w-10 h-10 bg-primary-600 rounded-full border-2 border-white hover:bg-primary-500 transition-colors'
                    title={`Perfil de ${user.name}`}
                    onClick={() => console.log('Abrir menu do usuário')}
                  >
                    <span className='text-sm font-bold text-white'>{user.initials}</span>
                  </button>
                  {/* Botão de Logout - visível apenas quando logado */}
                  {isAuthenticated && (
                    <button
                      onClick={handleLogout}
                      className='flex items-center justify-center w-10 h-10 bg-red-600 rounded-full border-2 border-white hover:bg-red-500 transition-colors'
                      title='Fazer logout'
                    >
                      <LogOut className='w-4 h-4 text-white' />
                    </button>
                  )}
                </div>
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

      {/* Modal de Login */}
      <LoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLogin={handleLogin}
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => {
          setLoginModalOpen(false);
          setRegisterModalOpen(true);
        }}
      />

      {/* Modal de Cadastro */}
      <RegisterModal
        open={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onRegister={handleRegister}
        onSwitchToLogin={() => {
          setRegisterModalOpen(false);
          setLoginModalOpen(true);
        }}
      />
    </header>
  );
};

export default Header;
