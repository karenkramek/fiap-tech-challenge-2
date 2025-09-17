import React, { Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './components/Home';
import ErrorBoundary from './components/ErrorBoundary';
import Header from '../../shared/src/components/Header';
import Sidebar from '../../shared/src/components/Sidebar';
import './styles/global.css';

// Dynamic imports for microfrontends - these will be loaded at runtime
const Dashboard = React.lazy(() => import('dashboardMFE/Dashboard'));
const Transactions = React.lazy(() => import('transactionsMFE/Transactions'));

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
      <div className='flex'>
        {/* Sidebar fixa para desktop, visível a partir de md */}
        <div className='hidden xl:block w-64 p-4 min-h-screen'>
          <Sidebar currentPath={location.pathname} />
        </div>

        {/* Conteúdo principal */}
        <main className='container mx-auto px-4 py-8 flex-1'>
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
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Home />} />
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
                  <Transactions />
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

export default App;