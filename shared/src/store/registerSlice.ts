import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AccountService from '../services/AccountService';
import { login } from './authSlice';

interface RegisterState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const registerAccount = createAsyncThunk<
  void,
  { name: string; email: string; password: string },
  { rejectValue: string }
>(
  'register/registerAccount',
  async ({ name, email, password }, { rejectWithValue, dispatch }) => {
    try {
      await AccountService.createAccount(name, email, password);
      // Login automático após registro
      await dispatch(login({ email, password }));
      return;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao criar conta. Tente novamente.');
    }
  }
);

const initialState: RegisterState = {
  loading: false,
  error: null,
  success: false,
};

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    resetRegister(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerAccount.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(registerAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { resetRegister } = registerSlice.actions;
export type { RegisterState };
export default registerSlice.reducer;
