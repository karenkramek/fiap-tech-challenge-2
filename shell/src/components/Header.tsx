import { LogOut, Menu } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, Location as RouterLocation, useLocation, useNavigate } from 'react-router-dom';
import LoginModal from 'shared/components/domain/login/LoginModal';
import RegisterModal from 'shared/components/domain/login/RegisterModal';
import { showError, showSuccess } from 'shared/components/ui/FeedbackProvider';
import { TOAST_DURATION, TOAST_MESSAGES } from 'shared/constants/toast';
import { useAccount } from 'shared/hooks/useAccount';
import AccountService from 'shared/services/AccountService';

// Constantes para timing de UI
const MODAL_AUTO_OPEN_DELAY = 500; // ms para abrir modal após redirecionamento
const NAVIGATE_DELAY = 1000; // ms para aguardar toast antes de navegar

interface HeaderProps {
  toggleSidebar: () => void;
  showAuthButtons?: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, showAuthButtons = false }) => {
  const { account, loading, currentUser, login, logout, isAuthenticated } = useAccount();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Verificar se foi redirecionado de uma rota protegida e abrir modal automaticamente
  useEffect(() => {
    const state = location.state as { from?: RouterLocation } | null;
    if (state?.from && showAuthButtons && !isAuthenticated) {
      // Pequeno delay para garantir que o toast da ProtectedRoute já apareceu
      const timer = setTimeout(() => {
        setLoginModalOpen(true);
      }, MODAL_AUTO_OPEN_DELAY);

      // Limpar o state para evitar abrir o modal novamente
      navigate(location.pathname, { replace: true, state: {} });

      return () => clearTimeout(timer);
    }

    return () => {}; // Cleanup function para quando não há timer
  }, [location.state, showAuthButtons, isAuthenticated, navigate, location.pathname]);

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

      // Toast de boas-vindas
      showSuccess(`Bem-vindo(a), ${loggedAccount?.name || 'Usuário'}!`);

      // Redirecionar para dashboard após login bem-sucedido
      setTimeout(() => {
        navigate('/dashboard');
      }, NAVIGATE_DELAY); // Pequeno delay para mostrar o toast

    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Re-lança o erro para o modal tratar
    }
  };

  const handleLogout = () => {
    logout();
    showSuccess(TOAST_MESSAGES.LOGOUT_SUCCESS, TOAST_DURATION.SHORT);
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

      // Toast para cadastro
      showSuccess(`Conta criada para ${name}!`);

    } catch (error) {
      console.error('Error creating account:', error);

      // Toast de erro
      showError(TOAST_MESSAGES.REGISTER_ERROR);

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

          {/* Navigation Links - apenas na home */}
          {showAuthButtons && (
            <nav className='hidden md:flex items-center space-x-6 !ml-20'>
              <Link
                to="/"
                className='text-white hover:text-primary-200 transition-colors font-medium'
              >
                Início
              </Link>
              <Link
                to="/sobre"
                className='text-white hover:text-primary-200 transition-colors font-medium'
              >
                Sobre
              </Link>
            </nav>
          )}
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
                  <div className='w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold'>
                    {user.initials}
                  </div>
                  <button
                    onClick={handleLogout}
                    className='text-primary-200 hover:text-white transition-colors'
                    title='Logout'
                  >
                    <LogOut className='h-5 w-5' />
                  </button>
                </div>
              </>
            ) : (
              <div className='flex items-center space-x-3'>
                <div className='hidden md:block text-right'>
                  <p className='text-sm text-primary-200'>Não autenticado</p>
                </div>
                <div className='w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold'>
                  ?
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
