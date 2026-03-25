import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from './authApi';

interface AuthState {
  user: User | null;
  token?: string | null;
  refreshToken?: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Helper function to load from localStorage on client side
const loadFromLocalStorage = (): Partial<AuthState> => {
  if (typeof window !== 'undefined') {
    try {
      const token = localStorage.getItem('auth_token');
      const refreshToken = localStorage.getItem('auth_refresh_token');
      const userStr = localStorage.getItem('auth_user');
      
      return {
        token,
        refreshToken,
        user: userStr ? JSON.parse(userStr) : null,
        isAuthenticated: !!token,
      };
    } catch (error) {
      console.error('Error loading auth state from localStorage:', error);
    }
  }
  return {};
};

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  ...loadFromLocalStorage(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token?: string; refreshToken?: string }>
    ) => {
      const { user, token, refreshToken } = action.payload;
      state.user = user;
      state.token = token;
      if (refreshToken) {
        state.refreshToken = refreshToken;
      }
      state.isAuthenticated = true;
      state.error = null;

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token ?? "");
        localStorage.setItem('auth_user', JSON.stringify(user));
        if (refreshToken) {
          localStorage.setItem('auth_refresh_token', refreshToken);
        }
      }
    },
    updateTokens: (
      state,
      action: PayloadAction<{ token: string; refreshToken: string }>
    ) => {
      const { token, refreshToken } = action.payload;
      state.token = token;
      state.refreshToken = refreshToken;

      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_refresh_token', refreshToken);
      }
    },
    updateAccessToken: (
      state,
      action: PayloadAction<{ token: string;}>
    ) => {
      const { token } = action.payload;
      state.token = token;

      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
    
      }
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        
        // Update localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_user', JSON.stringify(state.user));
        }
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;

      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_refresh_token');
        localStorage.removeItem('auth_user');
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setCredentials,
  updateTokens,
  updateUser,
  logout,
  setLoading,
  setError,
  clearError,
  updateAccessToken,
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthToken = (state: { auth: AuthState }) => state.auth.token;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
