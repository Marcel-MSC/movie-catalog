import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  getCurrentUser,
  getUsers,
  saveUsers,
  setCurrentUser,
  clearCurrentUser,
  type CurrentUser,
  type StoredUser,
} from '../services/authStorage';

export type AuthState = {
  user: CurrentUser | null;
  status: 'idle' | 'loading' | 'error';
  error?: string;
};

const initialState: AuthState = {
  user: getCurrentUser(),
  status: 'idle',
  error: undefined,
};

export const registerUser = createAsyncThunk<
  CurrentUser,
  { email: string; password: string },
  { rejectValue: string }
>('auth/register', async ({ email, password }, { rejectWithValue }) => {
  const users = getUsers();

  const alreadyExists = users.some((u) => u.email === email);
  if (alreadyExists) {
    return rejectWithValue('E-mail already registered.');
  }

  const newUser: StoredUser = { email, password };
  const updatedUsers = [...users, newUser];
  saveUsers(updatedUsers);

  const currentUser: CurrentUser = { email };
  setCurrentUser(currentUser);

  return currentUser;
});

export const loginUser = createAsyncThunk<
  CurrentUser,
  { email: string; password: string },
  { rejectValue: string }
>('auth/login', async ({ email, password }, { rejectWithValue }) => {
  const users = getUsers();

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return rejectWithValue('Invalid email or password.');
  }

  const currentUser: CurrentUser = { email: user.email };
  setCurrentUser(currentUser);

  return currentUser;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.status = 'idle';
      state.error = undefined;
      clearCurrentUser();
    },
    setUserFromStorage(state, action: PayloadAction<CurrentUser | null>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'idle';
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload ?? 'Could not register user.';
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'idle';
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload ?? 'Could not login.';
      });
  },
});

export const { logout, setUserFromStorage } = authSlice.actions;
export const authReducer = authSlice.reducer;

