import React, { Suspense, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import FeedbackProvider from 'shared/components/ui/FeedbackProvider';
import LoadingSpinner from 'shared/components/ui/LoadingSpinner';
import ErrorBoundary from 'shared/components/ui/ErrorBoundary';
import Header from './components/Header';
import Home from './components/Home';
import ScrollToTop from './components/ScrollToTop';
import Sidebar from './components/Sidebar';

// Dynamic imports for microfrontends - these will be loaded at runtime
const Dashboard = React.lazy(() => import('dashboardMFE/Dashboard'));
const TransactionsPage = React.lazy(() => import('transactionsMFE/TransactionsPage'));

// Layout wrapper for home page
const HomeLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Header toggleSidebar={toggleSidebar} showAuthButtons={true} />
      <Home />

      {/* Overlay da sidebar mobile - backdrop */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 z-[9998] xl:hidden"
        />
      )}

      {/* Sidebar mobile como overlay */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-white-50 shadow-xl z-[9999] transform transition-transform duration-300 xl:hidden
                   ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          currentPath="/"
        />
      </div>
    </>
  );
};

// Layout wrapper for authenticated routes
const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Header toggleSidebar={toggleSidebar} />
      <div className='flex container mx-auto px-4 py-8 gap-6'>
        {/* Sidebar em telas maiores */}
        <div className="hidden bg-white-50 rounded-lg shadow-md xl:block lg:hidden w-64 p-4 min-h-screen flex-shrink-0">
          <Sidebar currentPath={location.pathname} />
        </div>

        {/* Conteúdo principal */}
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* Overlay da sidebar mobile - backdrop */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 z-[9998] xl:hidden"
        />
      )}

      {/* Sidebar mobile como overlay */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-white-50 shadow-xl z-[9999] transform transition-transform duration-300 xl:hidden
                   ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          currentPath={location.pathname}
        />
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<HomeLayout />} />
          <Route
            path="/dashboard"
            element={
              <AuthenticatedLayout>
                <ErrorBoundary>
                  <Suspense fallback={<div>Loading Dashboard...</div>}>
                    <Dashboard />
                  </Suspense>
                </ErrorBoundary>
              </AuthenticatedLayout>
            }
          />
          <Route
            path="/transactions/*"
            element={
              <AuthenticatedLayout>
                <Suspense fallback={<div className="flex justify-center items-center h-64">Carregando Transações...</div>}>
                  <TransactionsPage />
                </Suspense>
              </AuthenticatedLayout>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

const ShellApp: React.FC = () => {
  return (
    <>
      <FeedbackProvider />
      <Suspense fallback={<LoadingSpinner />}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </Suspense>
    </>
  );
};

export default ShellApp;
