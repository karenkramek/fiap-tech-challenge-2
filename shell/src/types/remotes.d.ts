// Global types for shared components
type ToastOptions = { duration?: number };

declare module 'dashboardMFE/Dashboard' {
  const Dashboard: React.ComponentType;
  export default Dashboard;
}

declare module 'transactionsMFE/TransactionsPage' {
  const TransactionsPage: React.ComponentType;
  export default TransactionsPage;
}

declare module 'shared/hooks/useAccount' {
  interface Account {
    id: string;
    name: string;
    email: string;
    balance: number;
    created_at: string;
    updated_at: string;
  }

  export function useAccount(): {
    account: Account | null;
    loading: boolean;
    error: Error | null;
    currentUser: { id: string; name: string; email: string } | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<Account>;
    logout: () => void;
    refreshAccount: () => Promise<void>;
  };
}

declare module 'shared/services/AccountService' {
  const AccountService: {
    createAccount: (
      name: string,
      email: string,
      password: string
    ) => Promise<any>;
  };
  export default AccountService;
}

declare module 'shared/hooks/useAuthProtection' {
  interface AuthConfig {
    publicRoutes?: string[];
    redirectTo?: string;
    showToast?: boolean;
    toastMessage?: string;
  }

  interface AuthCheckResult {
    isAuthenticated: boolean;
    loading: boolean;
    isPublicRoute: boolean;
    shouldRedirect: boolean;
    shouldShowToast: boolean;
    currentUser: { id: string; name: string; email: string } | null;
  }

  export function useAuthProtection(currentPath: string, config?: AuthConfig): AuthCheckResult;
  export function createAuthConfig(overrides?: Partial<AuthConfig>): AuthConfig;
  export function isRoutePublic(path: string, publicRoutes?: string[]): boolean;
  export const DEFAULT_PUBLIC_ROUTES: string[];
}

declare module 'shared/constants/toast' {
  export const TOAST_DURATION: {
    readonly SHORT: 2000;
    readonly NORMAL: 3000;
    readonly LONG: 5000;
  };

  export const TOAST_MESSAGES: {
    readonly LOGIN_SUCCESS: string;
    readonly LOGOUT_SUCCESS: string;
    readonly REGISTER_SUCCESS: string;
    readonly REGISTER_ERROR: string;
    readonly AUTH_REQUIRED: string;
    readonly TRANSACTION_SUCCESS: string;
    readonly TRANSACTION_ERROR: string;
    readonly INVALID_AMOUNT: string;
  };
}

declare module 'shared/constants/routes' {
  export const PUBLIC_ROUTES: readonly string[];
  export const PROTECTED_ROUTES: readonly string[];
  export const DEFAULT_REDIRECT_ROUTE: string;
}

declare module 'shared/*' {
  const component: any;
  export default component;
}

declare module 'shared/components/ui/FeedbackProvider' {
  const FeedbackProvider: React.ComponentType;
  export default FeedbackProvider;

  // Toast functions
  export function showSuccess(msg: string, duration?: number): void;
  export function showError(msg: string, duration?: number): void;
  export function showLoading(msg: string): void;
  export function dismissLoading(): void;
}

declare module 'shared/components/ui/ErrorBoundary' {
  import { ReactNode } from 'react';
  const ErrorBoundary: React.ComponentType<{ children: ReactNode; fallback?: ReactNode }>;
  export default ErrorBoundary;
}

declare module 'shared/components/ui/LoadingSpinner' {
  const LoadingSpinner: React.ComponentType<{ size?: number }>;
  export default LoadingSpinner;
}
declare module 'shared/components/ui/ModalCloseButton' {
  const ModalCloseButton: React.FC<{
    onClick: () => void;
    className?: string;
    ariaLabel?: string;
  }>;
  export default ModalCloseButton;
}
