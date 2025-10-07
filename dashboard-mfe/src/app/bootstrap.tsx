import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../App';
import '../styles/styles.css';
import { BrowserRouter, useLocation, Navigate } from 'react-router-dom';
// @ts-ignore
import ErrorBoundary from 'shared/components/ui/ErrorBoundary';
import { useAuthProtection } from 'shared/hooks/useAuthProtection';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

function ProtectedApp() {
  const location = useLocation();
  const { isAuthenticated, loading, isPublicRoute } = useAuthProtection(location.pathname);
  if (loading) return <div>Carregando...</div>;
  if (!isAuthenticated && !isPublicRoute) return <Navigate to="/" replace />;
  return <App />;
}

const root = createRoot(container);
root.render(
  <ErrorBoundary>
    <BrowserRouter>
      <ProtectedApp />
    </BrowserRouter>
  </ErrorBoundary>
);