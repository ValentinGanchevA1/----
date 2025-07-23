import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  AuthState,
  AuthUser,
  RegisterRequest,
  LoginRequest,
  RegisterResponse,
} from '@/types';
import * as authAPI from '@/services/authAPI';
import { normalizeError, AppError } from '@/utils/errorHandler';
import { RootState } from '../store';

// =================================================================
// Thunks for Asynchronous Actions
// =================================================================

/**
 * A thunk that signals the completion of the initial auth state setup.
 * In a real app, this could be used to validate a persisted token against the server.
 * Here, it checks the state after rehydration to confirm if a user session exists.
 */
export const initializeAuth = createAsyncThunk<
  // Return the user object on success
  AuthUser,
  // No arguments needed
  void,
  { state: RootState; rejectValue: AppError }
>('auth/initialize', async (_, { getState, rejectWithValue }) => {
  try {
    // After redux-persist rehydration, check if the token and user exist.
    const { token, user } = getState().auth;
    if (token && user) {
      // You could add token validation logic here, e.g., authAPI.verifyToken(token)
      return user;
    }
    // If no token, the user is not logged in.
    return rejectWithValue(normalizeError(null, 'No active session found.'));
  } catch (error) {
    return rejectWithValue(normalizeError(error, 'Session validation failed.'));
  }
});

/**
 * Handles user registration by calling the auth API.
 */
export const registerUser = createAsyncThunk<
  RegisterResponse['data'],
  RegisterRequest,
  { rejectValue: AppError }
>('auth/register', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authAPI.register(credentials);
    return response.data;
  } catch (error) {
    return rejectWithValue(normalizeError(error, 'Registration failed.'));
  }
});

/**
 * Handles user login by calling the auth API.
 */
export const loginUser = createAsyncThunk<
  RegisterResponse['data'],
  LoginRequest,
  { rejectValue: AppError }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authAPI.login(credentials);
    return response.data;
  } catch (error) {
    return rejectWithValue(normalizeError(error, 'Login failed.'));
  }
});

// =================================================================
// Initial State
// =================================================================

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
  isLoading: true, // Start in a loading state until initialization is complete
  error: null,
};

// =================================================================
// Auth Slice Definition
// =================================================================

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Clears user session data from the state upon logout.
     */
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.error = null;
    },
    /**
     * Clears any existing authentication errors from the state.
     */
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle pending states for login/register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      });

    // Handle fulfilled states for login/register
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user as AuthUser;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user as AuthUser;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isLoading = false;
      });

    // Handle rejected states for login/register
    builder
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? null;
      });

    // Handle initial auth check
    builder
      .addCase(initializeAuth.fulfilled, (state, action) => {
        // This confirms the rehydrated state is valid.
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(initializeAuth.rejected, (state) => {
        // This means no valid session was found.
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
