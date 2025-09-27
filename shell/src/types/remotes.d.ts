declare module 'dashboardMFE/Dashboard' {
  const Dashboard: React.ComponentType;
  export default Dashboard;
}

declare module 'transactionsMFE/TransactionsPage' {
  const TransactionsPage: React.ComponentType;
  export default TransactionsPage;
}

declare module 'shared/hooks/useAccount' {
  export function useAccount(): {
    account: { name: string; balance: number } | null;
    loading: boolean;
    currentUser: { id: string; name: string; email: string; isAuthenticated: boolean } | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<any>;
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

declare module 'shared/*' {
  const component: any;
  export default component;
}

declare module 'shared/components/ui/FeedbackProvider' {
  const FeedbackProvider: React.ComponentType;
  export default FeedbackProvider;
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
