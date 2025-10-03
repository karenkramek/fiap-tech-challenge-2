import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import registerReducer from './registerSlice';

// Middleware para persistir usuário autenticado
const persistAuthMiddleware = (storeAPI: any) => (next: any) => (action: any) => {
  const result = next(action);
  const state = storeAPI.getState();
  if (state.auth.user) {
    localStorage.setItem('authUser', JSON.stringify(state.auth.user));
  } else {
    localStorage.removeItem('authUser');
  }
  return result;
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    register: registerReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(persistAuthMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
