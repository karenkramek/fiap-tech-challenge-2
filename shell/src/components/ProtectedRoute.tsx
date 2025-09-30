// Componente para proteção de rotas baseado em lista de permissões (allow list)
// Define rotas públicas e protege automaticamente todas as outras.
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { showError } from 'shared/components/ui/FeedbackProvider';
import LoadingSpinner from 'shared/components/ui/LoadingSpinner';
import { useAuthProtection, type AuthConfig } from 'shared/hooks/useAuthProtection';
import { TOAST_MESSAGES } from 'shared/constants/toast';

interface ProtectedRouteProps extends Partial<AuthConfig> {
  children: React.ReactNode;
}

const ProtectedRoute = ({
  children,
  publicRoutes,
  redirectTo,
  showToast,
  toastMessage
}: ProtectedRouteProps) => {
  const location = useLocation();

  // Construir config apenas com propriedades definidas
  const config: AuthConfig = {
    ...(publicRoutes !== undefined && { publicRoutes }),
    ...(redirectTo !== undefined && { redirectTo }),
    ...(showToast !== undefined && { showToast }),
    ...(toastMessage !== undefined && { toastMessage }),
  };

  const {
    loading,
    isPublicRoute,
    shouldRedirect,
    shouldShowToast
  } = useAuthProtection(location.pathname, config);

  useEffect(() => {
    if (shouldShowToast) {
      showError(toastMessage || TOAST_MESSAGES.AUTH_REQUIRED);
    }
  }, [shouldShowToast, toastMessage]);

  // Ainda carregando, mostra um indicador
  if (loading) {
    return <LoadingSpinner />;
  }

  // Se for rota pública, sempre permite acesso.
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Se deve redirecionar, faz o redirecionamento.
  if (shouldRedirect) {
    return <Navigate to={redirectTo || '/'} replace state={{ from: location }} />;
  }

  // Se estiver autenticado, renderiza o conteúdo.
  return <>{children}</>;
};

export default ProtectedRoute;
