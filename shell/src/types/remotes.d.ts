declare module 'dashboardMFE/Dashboard' {
  const Dashboard: React.ComponentType;
  export default Dashboard;
}

declare module 'transactionsMFE/Transactions' {
  const Transactions: React.ComponentType;
  export default Transactions;
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

declare module 'shared/*' {
  const component: any;
  export default component;
}

declare module 'investmentsMFE/Investments' {
  const Investments: React.ComponentType<any>;
  export default Investments;
}
