import { configureStore } from '@reduxjs/toolkit';
import { render, RenderOptions } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { Provider } from 'react-redux';

// Configuração básica do Redux store para testes
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: (state = { user: { id: 'test-user', name: 'Test User' } }) => state,
    },
    preloadedState: {
      auth: { user: { id: 'test-user', name: 'Test User' } },
      ...initialState,
    },
  });
};

// Wrapper personalizado para componentes com Redux
const ReduxWrapper: React.FC<{
  children: React.ReactNode;
  initialState?: any;
}> = ({ children, initialState = {} }) => {
  const store = createTestStore(initialState);
  return <Provider store={store}>{children}</Provider>;
};

// Função customizada de render para testes
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    initialState?: any;
  }
) => {
  const { initialState, ...renderOptions } = options || {};

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ReduxWrapper initialState={initialState}>{children}</ReduxWrapper>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
