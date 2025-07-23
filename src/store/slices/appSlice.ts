import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// --- Type Definition for App State ---
interface AppState {
  /** Tracks if the core services of the app have been successfully initialized. */
  isInitialized: boolean;
  /** Tracks the network connectivity status of the device. */
  isOnline: boolean;
  /** Stores a global error message for displaying in a banner or modal. */
  globalError: string | null;
}

// --- Initial State ---
const initialState: AppState = {
  isInitialized: false,
  isOnline: true, // Assume online by default; can be updated by a network listener.
  globalError: null,
};

// --- App Slice Definition ---

/**
 * The app slice manages global state related to the application's lifecycle
 * and environment, rather than user-specific data.
 */
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    /**
     * Sets the application's initialization status. This should be dispatched
     * from the AppInitializer once all critical services are ready.
     */
    setAppInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },

    /**
     * Updates the network connectivity status. This can be connected to
     * a listener like @react-native-community/netinfo.
     */
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },

    /**
     * Sets or clears a global error message.
     */
    setGlobalError: (state, action: PayloadAction<string | null>) => {
      state.globalError = action.payload;
    },
  },
});

// --- Export Actions and Reducer ---
export const { setAppInitialized, setOnlineStatus, setGlobalError } = appSlice.actions;

export default appSlice.reducer;
