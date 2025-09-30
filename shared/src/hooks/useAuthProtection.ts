import { useMemo } from 'react';
import { useAccount } from './useAccount';
import { PUBLIC_ROUTES } from '../constants/routes';

export interface AuthConfig {
  publicRoutes?: string[];
  redirectTo?: string;
  showToast?: boolean;
  toastMessage?: string;
}

// Rotas públicas padrão (não requerem autenticação)
export const DEFAULT_PUBLIC_ROUTES = [...PUBLIC_ROUTES];

export interface AuthCheckResult {
  isAuthenticated: boolean;
  loading: boolean;
  isPublicRoute: boolean;
  shouldRedirect: boolean;
  shouldShowToast: boolean;
  currentUser: { id: string; name: string; email: string } | null;
}

/**
 * Hook para verificação de proteção de rotas baseado em lista de permissões.
 * Define quais rotas são públicas e protege automaticamente todas as outras.
 *
 * @param currentPath - Caminho da rota atual
 * @param config - Configuração de autenticação
 * @returns Resultado da verificação de autenticação
 */
export function useAuthProtection(
  currentPath: string,
  config: AuthConfig = {}
): AuthCheckResult {
  const {
    publicRoutes = DEFAULT_PUBLIC_ROUTES,
    showToast = true
  } = config;

  const { isAuthenticated, currentUser, loading } = useAccount();

  const isPublicRoute = useMemo(() => {
    return publicRoutes.some(route => {
      // Suporte para rotas exatas e com wildcard
      if (route.endsWith('/*')) {
        const basePath = route.slice(0, -2);
        return currentPath.startsWith(basePath);
      }
      return currentPath === route;
    });
  }, [currentPath, publicRoutes]);

  const shouldRedirect = useMemo(() => {
    return !loading && !isAuthenticated && !isPublicRoute;
  }, [loading, isAuthenticated, isPublicRoute]);

  const shouldShowToast = useMemo(() => {
    return shouldRedirect && showToast;
  }, [shouldRedirect, showToast]);

  return {
    isAuthenticated,
    loading,
    isPublicRoute,
    shouldRedirect,
    shouldShowToast,
    currentUser
  };
}

/**
 * Utilitário para verificar se uma rota é pública
 * @param path - Caminho a ser verificado
 * @param publicRoutes - Lista de rotas públicas (opcional)
 * @returns true se a rota for pública
 */
export function isRoutePublic(path: string, publicRoutes: string[] = DEFAULT_PUBLIC_ROUTES): boolean {
  return publicRoutes.some(route => {
    if (route.endsWith('/*')) {
      const basePath = route.slice(0, -2);
      return path.startsWith(basePath);
    }
    return path === route;
  });
}

/**
 * Utilitário para criar configurações de auth com valores padrão
 * @param overrides - Valores para sobrescrever os padrões
 * @returns Configuração completa de autenticação
 */
export function createAuthConfig(overrides: Partial<AuthConfig> = {}): AuthConfig {
  return {
    publicRoutes: DEFAULT_PUBLIC_ROUTES,
    redirectTo: '/',
    showToast: true,
    toastMessage: 'Por favor, faça login para acessar esta página.',
    ...overrides
  };
}
