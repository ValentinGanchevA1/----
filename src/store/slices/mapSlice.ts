import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Region } from 'react-native-maps';
import { User, Product, Coordinates } from '@/types';
import { normalizeError, AppError } from '@/utils/errorHandler';
// These encapsulate API calls.
import * as userAPI from './../../services/userAPI';
import * as productAPI from './../../services/productAPI';

// --- Type Definition for Map State ---
interface MapState {
  /** The current visible region of the map, controlled by user interaction. */
  mapRegion: Region | null;
  /** The user's last known GPS coordinates. */
  userLocation: Coordinates | null;
  /** A list of users to display on the map. */
  nearbyUsers: User[];
  /** A list of products to display on the map. */
  nearbyProducts: Product[];
  /** Tracks loading state for fetching nearby data. */
  isLoading: boolean;
  /** Stores any errors related to map data fetching. */
  error: AppError | null;
}

// --- Initial State ---
const initialState: MapState = {
  mapRegion: null,
  userLocation: null,
  nearbyUsers: [],
  nearbyProducts: [],
  isLoading: false,
  error: null,
};

// =================================================================
// Thunks for Asynchronous Actions
// =================================================================

/**
 * Fetches nearby users and products based on a given location and radius.
 * This would be called when the map view changes significantly.
 */
export const fetchNearbyData = createAsyncThunk<
  // Return type on success
  { users: User[]; products: Product[] },
  // Argument type
  { latitude: number; longitude: number; radius: number },
  // Thunk config
  { rejectValue: AppError }
>('map/fetchNearbyData', async (searchParams, { rejectWithValue }) => {
  try {
    // Perform API calls in parallel for efficiency
    const [usersResponse, productsResponse] = await Promise.all([
      userAPI.searchUsers(searchParams),
      productAPI.searchProducts(searchParams),
    ]);

    return {
      users: usersResponse.data.items,
      products: productsResponse.data.items,
    };
  } catch (error) {
    return rejectWithValue(normalizeError(error, 'Failed to fetch nearby data.'));
  }
});

/**
 * Updates the user's location on the server. This is a background task
 * that can be dispatched by the LocationService.
 */
export const updateUserLocation = createAsyncThunk<
  // Return type on success (the updated location)
  Coordinates,
  // Argument type
  Coordinates,
  // Thunk config
  { rejectValue: AppError }
>('map/updateUserLocation', async (location, { rejectWithValue }) => {
  try {
    // In a real app, this would be an API call:
    // await userAPI.updateLocation(location);
    console.log('Updating user location on server:', location);
    return location; // Return the location on success
  } catch (error) {
    return rejectWithValue(normalizeError(error, 'Failed to update location on server.'));
  }
});

// =================================================================
// Map Slice Definition
// =================================================================

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    /**
     * Updates the map's visible region in the state. This should be dispatched
     * when the user finishes panning or zooming the map.
     */
    setMapRegion(state, action: PayloadAction<Region>) {
      state.mapRegion = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handle fetching nearby data
    builder
      .addCase(fetchNearbyData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNearbyData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.nearbyUsers = action.payload.users;
        state.nearbyProducts = action.payload.products;
      })
      .addCase(fetchNearbyData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? null;
      });

    // Handle updating the user's location
    builder
      .addCase(updateUserLocation.fulfilled, (state, action) => {
        // Update the user's location in the state upon successful API call
        state.userLocation = action.payload;
      })
      .addCase(updateUserLocation.rejected, (state, action) => {
        // Log the error for debugging, but don't necessarily show a UI error
        // as this is often a background task.
        console.error('Failed to sync location with server:', action.payload);
      });
  },
});

// --- Export Actions and Reducer ---
export const { setMapRegion } = mapSlice.actions;

export default mapSlice.reducer;
