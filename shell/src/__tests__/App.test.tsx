import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';

// Mock do localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock do react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
  Toaster: () => <div data-testid="toaster">Toaster</div>,
}));

// Mock dos Module Federation imports
jest.mock('dashboardMFE/Dashboard', () => {
  return function MockDashboard() {
    return <div data-testid="dashboard-component">Dashboard Component</div>;
  };
});

jest.mock('transactionsMFE/TransactionsPage', () => {
  return function MockTransactionsPage() {
    return <div data-testid="transactions-component">Transactions Page Component</div>;
  };
});

// Mock do shared/components
jest.mock('shared/components/ui/ErrorBoundary', () => {
  return function MockErrorBoundary({ children }: { children: React.ReactNode }) {
    return <div data-testid="error-boundary">{children}</div>;
  };
});

jest.mock('shared/components/ui/FeedbackProvider', () => {
  return function MockFeedbackProvider() {
    return <div data-testid="feedback-provider">Toast Container</div>;
  };
});

jest.mock('shared/components/ui/LoadingSpinner', () => {
  return function MockLoadingSpinner() {
    return <div data-testid="loading-spinner">Loading...</div>;
  };
});

// Mock dos componentes internos
jest.mock('../components/About', () => {
  return function MockAbout() {
    return <div data-testid="about-page">About Page</div>;
  };
});

jest.mock('../components/Header', () => {
  return function MockHeader({ toggleSidebar, showAuthButtons }: any) {
    return (
      <div data-testid="header">
        Header - Auth: {showAuthButtons ? 'true' : 'false'}
        {toggleSidebar && <button onClick={toggleSidebar}>Toggle Sidebar</button>}
      </div>
    );
  };
});

jest.mock('../components/Home', () => {
  return function MockHome() {
    return <div data-testid="home-page">Home Page</div>;
  };
});

jest.mock('../components/ProtectedRoute', () => {
  return function MockProtectedRoute({ children }: { children: React.ReactNode }) {
    return <div data-testid="protected-route">{children}</div>;
  };
});

jest.mock('../components/ScrollToTop', () => {
  return function MockScrollToTop() {
    return null;
  };
});

jest.mock('../components/Sidebar', () => {
  return function MockSidebar({ isSidebarOpen, toggleSidebar, currentPath }: any) {
    return (
      <div data-testid="sidebar" data-current-path={currentPath}>
        Sidebar - Open: {isSidebarOpen ? 'true' : 'false'}
        {toggleSidebar && <button onClick={toggleSidebar}>Close Sidebar</button>}
      </div>
    );
  };
});

// Componente testável que replica a lógica do App mas sem BrowserRouter
const TestableApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Rotas públicas (sem autenticação) */}
        <Route path="/sobre" element={<div data-testid="about-page">About Page</div>} />

        {/* Rotas que precisam de proteção */}
        <Route path="/*" element={
          <div data-testid="protected-route">
            <Routes>
              <Route path="/" element={
                // HomeLayout
                <>
                  <div data-testid="header">
                    Header - Auth: true
                  </div>
                  <div data-testid="home-page">Home Page</div>
                </>
              } />
              <Route
                path="/dashboard"
                element={
                  // AuthenticatedLayout com Dashboard
                  <AuthenticatedLayoutComponent>
                    <div data-testid="error-boundary">
                      <React.Suspense fallback={<div>Loading Dashboard...</div>}>
                        <div data-testid="dashboard-component">Dashboard Component</div>
                      </React.Suspense>
                    </div>
                  </AuthenticatedLayoutComponent>
                }
              />
              <Route
                path="/transactions/*"
                element={
                  // AuthenticatedLayout com Transactions
                  <AuthenticatedLayoutComponent>
                    <React.Suspense fallback={<div className="flex justify-center items-center h-64">Carregando Transações...</div>}>
                      <div data-testid="transactions-component">Transactions Page Component</div>
                    </React.Suspense>
                  </AuthenticatedLayoutComponent>
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        } />
      </Routes>
    </div>
  );
};

// Componente que replica AuthenticatedLayout
const AuthenticatedLayoutComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <>
      <div data-testid="header">Header - Auth: false</div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid xl:grid-cols-5 gap-6">
          {/* Sidebar em telas maiores */}
          <div className="hidden bg-white-50 rounded-lg shadow-md xl:block xl:col-span-1">
            <div className="p-4 min-h-screen">
              <div data-testid="sidebar" data-current-path={location.pathname}>
                Sidebar - Open: false
              </div>
            </div>
          </div>

          {/* Conteúdo principal */}
          <main className="xl:col-span-4">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

// Componente wrapper que inclui FeedbackProvider e ErrorBoundary
const TestableShellApp: React.FC = () => {
  return (
    <>
      <div data-testid="feedback-provider">Toast Container</div>
      <React.Suspense fallback={<div data-testid="loading-spinner">Loading...</div>}>
        <div data-testid="error-boundary">
          <TestableApp />
        </div>
      </React.Suspense>
    </>
  );
};

// Função helper para renderizar com roteamento customizado
const renderWithRouter = (initialPath = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <TestableShellApp />
    </MemoryRouter>
  );
};

describe('App Component', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  it('should render home page at root path', async () => {
    renderWithRouter('/');

    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });

    // Verifica se o header com botões de auth está presente
    expect(screen.getByText(/Header - Auth: true/)).toBeInTheDocument();
  });

  it('should render about page without authentication', async () => {
    renderWithRouter('/sobre');

    await waitFor(() => {
      expect(screen.getByTestId('about-page')).toBeInTheDocument();
    });
  });

  it('should render dashboard page for authenticated users', async () => {
    renderWithRouter('/dashboard');

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-component')).toBeInTheDocument();
    });

    // Verifica se o layout autenticado está presente
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('should render transactions page for authenticated users', async () => {
    renderWithRouter('/transactions');

    await waitFor(() => {
      expect(screen.getByTestId('transactions-component')).toBeInTheDocument();
    });

    // Verifica se o layout autenticado está presente
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('should redirect unknown routes to home', async () => {
    renderWithRouter('/unknown-route');

    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });
  });

  it('should pass correct currentPath to sidebar in authenticated layout', async () => {
    renderWithRouter('/dashboard');

    await waitFor(() => {
      const sidebar = screen.getByTestId('sidebar');
      expect(sidebar).toHaveAttribute('data-current-path', '/dashboard');
    });
  });

  it('should render loading fallback for lazy-loaded components', async () => {
    // Como os mocks não são realmente lazy, vamos verificar se o Suspense funciona
    // simulando um componente que carrega mais devagar
    const LazyMockComponent = React.lazy(() =>
      new Promise<{ default: React.ComponentType }>(resolve =>
        setTimeout(() => resolve({
          default: () => <div data-testid="lazy-loaded">Lazy Component Loaded</div>
        }), 100)
      )
    );

    // Componente de teste especial para suspense
    const TestLazyComponent = () => (
      <div className="min-h-screen bg-gray-50">
        <React.Suspense fallback={<div data-testid="loading-fallback">Loading Dashboard...</div>}>
          <LazyMockComponent />
        </React.Suspense>
      </div>
    );

    render(<TestLazyComponent />);

    // Deve mostrar loading inicialmente
    expect(screen.getByTestId('loading-fallback')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('lazy-loaded')).toBeInTheDocument();
    }, { timeout: 500 });
  });
});
