import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// It is a best practice to create and export typed versions of the
// `useDispatch` and `useSelector` hooks for use throughout your application.
// This avoids the need to import `RootState` and `AppDispatch` in every component.

/**
 * A typed version of the `useDispatch` hook from React Redux.
 * This hook is aware of the thunks and actions available in your app.
 */
export const useAppDispatch: () => AppDispatch = useDispatch;

/**
 * A typed version of the `useSelector` hook from React Redux.
 * This hook knows the exact shape of your entire Redux state tree.
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
