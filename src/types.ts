import { Region } from 'react-native-maps';
import { AppError } from '@/utils/errorHandler';

// =================================================================
// Navigation Param Lists
// =================================================================

/**
 * Defines the screen parameters for the main bottom tab navigator.
 * `undefined` means the route takes no params.
 */
export type MainTabParamList = {
  Map: undefined;
  Profile: undefined;
};

/**
 * Defines the screen parameters for the authentication stack navigator.
 */
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

// =================================================================
// Core Data Models
// =================================================================

/**
 * Represents the basic geographic coordinates.
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Represents the authenticated user's core data.
 */
export interface AuthUser {
  id: string;
  username: string;
  email: string;
}

/**
 * Represents a user object as it would appear on the map,
 * combining auth data with location data.
 */
export interface User extends AuthUser, Coordinates {}

/**
 * Represents a product object with its location.
 */
export interface Product extends Coordinates {
  id: string;
  name: string;
  price: number;
  description?: string;
}

// =================================================================
// Redux State Slice Definitions
// =================================================================

/**
 * The shape of the authentication state in the Redux store.
 */
export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  error: AppError | null;
}

/**
 * The shape of the map state in the Redux store.
 */
export interface MapState {
  mapRegion: Region | null;
  userLocation: Coordinates | null;
  nearbyUsers: User[];
  nearbyProducts: Product[];
  isLoading: boolean;
  error: AppError | null;
}

// =================================================================
// API Request & Response Payloads
// =================================================================

/**
 * Payload for the user login request.
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Payload for the user registration request.
 */
export interface RegisterRequest extends LoginRequest {
  username: string;
}

/**
 * The structure of the data returned upon successful authentication.
 */
export interface AuthResponseData {
  user: AuthUser;
  token: string;
}

/**
 * The expected shape of the full response from the auth endpoints.
 */
export interface RegisterResponse {
  data: AuthResponseData;
}

/**
 * A generic API error response structure.
 */
export interface ApiErrorResponse {
  error: AppError;
}
