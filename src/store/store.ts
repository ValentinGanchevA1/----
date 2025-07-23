import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import your slice reducers here
import authReducer from './slices/authSlice';
import appReducer from './slices/appSlice';
import mapReducer from './slices/mapSlice'; // Assuming this slice exists for map data

// --- Root Reducer ---
// Combine all your slice reducers into a single root reducer.
const rootReducer = combineReducers({
  auth: authReducer,
  app: appReducer,
  map: mapReducer,
});

// --- Redux Persist Configuration ---
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  // Whitelist specifies which state slices will be persisted.
  // 'auth' is a good candidate to keep the user logged in across app launches.
  // Other non-serializable or transient data should be left out.
  whitelist: ['auth'],
};

// Create a new reducer that includes the persistence capabilities.
const persistedReducer = persistReducer(persistConfig, rootReducer);

// --- Store Configuration ---
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // This is required to avoid serialization errors with redux-persist.
      // It tells Redux Toolkit to ignore the action types that redux-persist dispatches.
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// --- Persistor ---
// The persistor is what makes the magic happen, saving and rehydrating the state.
export const persistor = persistStore(store);

// --- Type Definitions for Hooks ---
// Infer the `RootState` and `AppDispatch` types from the store itself.
// This is a best practice for type-safe interaction with your Redux store.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
