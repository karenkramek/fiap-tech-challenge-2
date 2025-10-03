import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AccountService from '../services/AccountService';

interface AccountData {
  id: string;
  name: string;
  email: string;
  balance: number;
  // Adicione outros campos necessários
}

interface AuthState {
  user: AccountData | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export const login = createAsyncThunk<
  AccountData,
  { email: string; password: string },
  { rejectValue: string }
>(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const account = await AccountService.login(email, password);
      // Retorna apenas os dados, não a instância da classe
      return {
        id: account.id,
        name: account.name,
        email: account.email || '',
        balance: account.balance,
        // Adicione outros campos necessários
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Email ou senha incorretos. Tente novamente.');
    }
  }
);

const getPersistedUser = (): AccountData | null => {
  try {
    const data = localStorage.getItem('authUser');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user: getPersistedUser(),
  loading: false,
  error: null,
  isAuthenticated: !!getPersistedUser(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AccountData>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = authSlice.actions;
export type { AuthState, AccountData };
export default authSlice.reducer;
